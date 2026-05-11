import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize sample data (run once on first setup)
app.post('/make-server-42252885/init-data', async (c) => {
  try {
    // Check if admin already exists
    const existingAdmins = await kv.getByPrefix('user:');
    const hasAdmin = existingAdmins.some((u: any) => u.isAdmin);

    if (hasAdmin) {
      return c.json({ message: 'Admin already exists' }, 400);
    }

    // Create admin user in Supabase Auth
    const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@passthepaper.com',
      password: 'admin123',
      user_metadata: { name: 'Admin User' },
      email_confirm: true,
    });

    if (adminAuthError) {
      console.error('Admin creation error:', adminAuthError);
      return c.json({ message: adminAuthError.message }, 400);
    }

    // Store admin data
    const adminData = {
      id: adminAuthData.user.id,
      email: 'admin@passthepaper.com',
      name: 'Admin User',
      university: 'Pass The Paper',
      isVerified: true,
      isAdmin: true,
      walletBalance: 0,
      createdAt: new Date().toISOString(),
    };
    await kv.set(`user:${adminAuthData.user.id}`, adminData);

    // Create sample student users
    const students = [
      { email: 'john@university.edu', password: 'student123', name: 'John Doe', university: 'State University', studentId: 'STU001' },
      { email: 'jane@university.edu', password: 'student123', name: 'Jane Smith', university: 'Tech Institute', studentId: 'STU002' },
      { email: 'mike@university.edu', password: 'student123', name: 'Mike Johnson', university: 'City College', studentId: 'STU003' },
    ];

    for (const student of students) {
      const { data: studentAuthData, error: studentAuthError } = await supabase.auth.admin.createUser({
        email: student.email,
        password: student.password,
        user_metadata: { name: student.name },
        email_confirm: true,
      });

      if (!studentAuthError && studentAuthData) {
        const studentData = {
          id: studentAuthData.user.id,
          email: student.email,
          name: student.name,
          university: student.university,
          studentId: student.studentId,
          isVerified: Math.random() > 0.5, // Random verification status for demo
          isAdmin: false,
          walletBalance: Math.floor(Math.random() * 300) + 100,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        await kv.set(`user:${studentAuthData.user.id}`, studentData);
      }
    }

    // Create sample resources
    const sampleResources = [
      {
        title: 'Computer Science 101 Final Exam 2023',
        description: 'Complete final exam with answers and explanations for CS101',
        category: 'Previous Papers',
        price: 50,
        status: 'pending',
      },
      {
        title: 'Data Structures Lecture Notes',
        description: 'Comprehensive lecture notes covering all topics in data structures',
        category: 'Lecture Notes',
        price: 30,
        status: 'approved',
      },
      {
        title: 'Calculus II Problem Set Solutions',
        description: 'Solutions to all problem sets from Calculus II course',
        category: 'Assignments',
        price: 40,
        status: 'approved',
      },
      {
        title: 'Physics Lab Reports',
        description: 'Collection of lab reports from Physics 201',
        category: 'Lab Reports',
        price: 0,
        status: 'approved',
      },
      {
        title: 'Database Design Midterm 2024',
        description: 'Midterm exam with detailed solutions',
        category: 'Previous Papers',
        price: 35,
        status: 'pending',
      },
    ];

    const userIds = students.map((_, i) => existingAdmins[i]?.id).filter(Boolean);
    
    sampleResources.forEach(async (resource, index) => {
      const uploaderIndex = index % 2;
      const fileId = `file:${Date.now() + index}:sample`;
      const fileData = {
        id: fileId,
        ...resource,
        uploadedBy: userIds[uploaderIndex] || 'sample-user',
        uploaderName: students[uploaderIndex]?.name || 'Sample User',
        fileUrl: 'https://example.com/sample.pdf',
        downloads: Math.floor(Math.random() * 100),
        rating: 4 + Math.random(),
        createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await kv.set(fileId, fileData);
    });

    return c.json({
      success: true,
      message: 'Sample data initialized successfully',
      adminCredentials: {
        email: 'admin@passthepaper.com',
        password: 'admin123',
      },
      studentCredentials: {
        email: 'john@university.edu',
        password: 'student123',
      },
    });
  } catch (error: any) {
    console.error('Init data error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Helper function to get authenticated user
async function getAuthenticatedUser(accessToken: string | null) {
  if (!accessToken) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }

  return user;
}

// Sign up route
app.post('/make-server-42252885/signup', async (c) => {
  try {
    const { email, password, name, university, studentId } = await c.req.json();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server hasn't been configured
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      return c.json({ message: authError.message }, 400);
    }

    // Store user data in KV store
    const userData = {
      id: authData.user.id,
      email,
      name,
      university,
      studentId,
      isVerified: false,
      isAdmin: false,
      walletBalance: 100, // Welcome bonus
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${authData.user.id}`, userData);

    return c.json({ success: true, userId: authData.user.id });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ message: error.message || 'Signup failed' }, 500);
  }
});

// Get current user data
app.get('/make-server-42252885/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json(userData);
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Admin routes
app.get('/make-server-42252885/admin/pending-users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const adminData = await kv.get(`user:${user.id}`);
    if (!adminData || !adminData.isAdmin) {
      return c.json({ message: 'Unauthorized: Admin access required' }, 403);
    }

    // Get all users
    const users = await kv.getByPrefix('user:');
    return c.json(users.filter((u: any) => !u.isAdmin));
  } catch (error: any) {
    console.error('Get pending users error:', error);
    return c.json({ message: error.message }, 500);
  }
});

app.post('/make-server-42252885/admin/verify-user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const adminData = await kv.get(`user:${user.id}`);
    if (!adminData || !adminData.isAdmin) {
      return c.json({ message: 'Unauthorized: Admin access required' }, 403);
    }

    const { userId, approve } = await c.req.json();

    if (approve) {
      const userData = await kv.get(`user:${userId}`);
      if (userData) {
        userData.isVerified = true;
        await kv.set(`user:${userId}`, userData);
      }
    } else {
      // Reject: delete user
      await kv.del(`user:${userId}`);
      await supabase.auth.admin.deleteUser(userId);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Verify user error:', error);
    return c.json({ message: error.message }, 500);
  }
});

app.get('/make-server-42252885/admin/pending-files', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const adminData = await kv.get(`user:${user.id}`);
    if (!adminData || !adminData.isAdmin) {
      return c.json({ message: 'Unauthorized: Admin access required' }, 403);
    }

    const files = await kv.getByPrefix('file:');
    return c.json(files.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (error: any) {
    console.error('Get pending files error:', error);
    return c.json({ message: error.message }, 500);
  }
});

app.post('/make-server-42252885/admin/approve-file', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const adminData = await kv.get(`user:${user.id}`);
    if (!adminData || !adminData.isAdmin) {
      return c.json({ message: 'Unauthorized: Admin access required' }, 403);
    }

    const { fileId, approve } = await c.req.json();
    const fileData = await kv.get(`file:${fileId}`);

    if (fileData) {
      fileData.status = approve ? 'approved' : 'rejected';
      await kv.set(`file:${fileId}`, fileData);

      // Award points to uploader if approved
      if (approve) {
        const uploaderData = await kv.get(`user:${fileData.uploadedBy}`);
        if (uploaderData) {
          uploaderData.walletBalance += 50; // Reward for approved upload
          await kv.set(`user:${fileData.uploadedBy}`, uploaderData);

          // Create transaction
          const transaction = {
            id: `tx:${Date.now()}:${fileData.uploadedBy}`,
            type: 'credit',
            amount: 50,
            description: `Upload approved: ${fileData.title}`,
            createdAt: new Date().toISOString(),
          };
          await kv.set(`transaction:${fileData.uploadedBy}:${Date.now()}`, transaction);
        }
      }
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Approve file error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Resources routes
app.get('/make-server-42252885/resources/featured', async (c) => {
  try {
    const files = await kv.getByPrefix('file:');
    const approvedFiles = files.filter((f: any) => f.status === 'approved');
    
    return c.json(
      approvedFiles
        .sort((a: any, b: any) => b.downloads - a.downloads)
        .slice(0, 6)
    );
  } catch (error: any) {
    console.error('Get featured resources error:', error);
    return c.json({ message: error.message }, 500);
  }
});

app.get('/make-server-42252885/resources', async (c) => {
  try {
    const category = c.req.query('category');
    const files = await kv.getByPrefix('file:');
    let approvedFiles = files.filter((f: any) => f.status === 'approved');

    if (category) {
      approvedFiles = approvedFiles.filter((f: any) => f.category === category);
    }

    return c.json(approvedFiles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (error: any) {
    console.error('Get resources error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Upload route
app.post('/make-server-42252885/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData || !userData.isVerified) {
      return c.json({ message: 'User not verified' }, 403);
    }

    const formData = await c.req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = parseInt(formData.get('price') as string || '0');

    // In a real app, you would upload the file to Supabase Storage here
    // For this prototype, we'll just create a placeholder URL
    const fileUrl = 'https://example.com/placeholder.pdf';

    const fileId = `file:${Date.now()}:${user.id}`;
    const fileData = {
      id: fileId,
      title,
      description,
      category,
      price,
      uploadedBy: user.id,
      uploaderName: userData.name,
      status: 'pending',
      fileUrl,
      downloads: 0,
      rating: 4.5,
      createdAt: new Date().toISOString(),
    };

    await kv.set(fileId, fileData);

    return c.json({ success: true, fileId });
  } catch (error: any) {
    console.error('Upload error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Wallet routes
app.get('/make-server-42252885/wallet/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const transactions = await kv.getByPrefix(`transaction:${user.id}:`);
    return c.json(transactions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return c.json({ message: error.message }, 500);
  }
});

app.post('/make-server-42252885/wallet/add-funds', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { amount, paymentMethod } = await c.req.json();
    const userData = await kv.get(`user:${user.id}`);

    if (userData) {
      userData.walletBalance += amount;
      await kv.set(`user:${user.id}`, userData);

      // Create transaction
      const transaction = {
        id: `tx:${Date.now()}:${user.id}`,
        type: 'credit',
        amount,
        description: `Added funds via ${paymentMethod}`,
        createdAt: new Date().toISOString(),
      };
      await kv.set(`transaction:${user.id}:${Date.now()}`, transaction);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Add funds error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Feedback route
app.post('/make-server-42252885/feedback', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { feedback } = await c.req.json();
    const feedbackData = {
      id: `feedback:${Date.now()}:${user.id}`,
      userId: user.id,
      feedback,
      createdAt: new Date().toISOString(),
    };

    await kv.set(feedbackData.id, feedbackData);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Feedback error:', error);
    return c.json({ message: error.message }, 500);
  }
});

// Password reset route
app.post('/make-server-42252885/reset-password', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getAuthenticatedUser(accessToken || null);

    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { newPassword } = await c.req.json();

    // Update password in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      console.error('Password reset error:', error);
      return c.json({ message: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return c.json({ message: error.message }, 500);
  }
});

Deno.serve(app.fetch);
