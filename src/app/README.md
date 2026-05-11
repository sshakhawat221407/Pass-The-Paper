# Pass The Paper - Academic Resource Marketplace

A comprehensive web application for verified university students to access, upload, donate, and exchange academic resources.

## 🎓 Overview

Pass The Paper is a student-only academic resource marketplace with:
- **User Authentication** - University email verification required
- **Admin Panel** - User verification and file approval system
- **Resource Marketplace** - Browse, search, and download academic materials
- **Upload System** - Share resources with approval workflow
- **Wallet System** - Points-based economy with Bkash/Nagad/Card support
- **Profile Management** - Password reset, feedback, and security features

## 🚀 Quick Start

### 1. First-Time Setup

On the login screen, click **"Setup"** at the bottom to initialize the application with sample data.

### 2. Test Accounts

After setup, use these credentials:

**Admin Access:**
```
Email: admin@passthepaper.com
Password: admin123
```

**Student Access:**
```
Email: john@university.edu
Password: student123
```

## 📱 Features

### Student Features
- ✅ University email registration
- ✅ Browse academic resources by category
- ✅ Search and filter resources
- ✅ Upload documents (requires verification)
- ✅ Wallet with points system
- ✅ Multiple payment methods (Bkash, Nagad, Card)
- ✅ Shopping cart functionality
- ✅ Transaction history
- ✅ Profile management
- ✅ Password reset
- ✅ Feedback system

### Admin Features
- ✅ User verification dashboard
- ✅ File approval system
- ✅ Search and filter pending items
- ✅ Approve/Reject users
- ✅ Approve/Reject uploaded files
- ✅ Automatic point rewards (50 pts per approved upload)
- ✅ Real-time status updates

## 🎨 Design System

**Color Palette:**
- Primary: `#E56E20` (Orange)
- Background: `#F0D7C7` (Light Peach)
- Cards: `#D4ECF7` (Light Blue)

**Theme:** Clean, academic, minimal design with card-based layouts, rounded corners, and subtle shadows.

## 🏗️ Architecture

**Frontend:**
- React with TypeScript
- Tailwind CSS v4
- Responsive design (mobile + desktop)
- Bottom navigation for mobile
- Client-side routing

**Backend:**
- Supabase Authentication
- Supabase Edge Functions (Hono server)
- Key-Value store for data persistence
- RESTful API endpoints

**Database Structure:**
- Users (with verification status)
- Resources (with approval workflow)
- Transactions (wallet history)
- Feedback submissions

## 📋 User Workflows

### Student Registration
1. Register with university email
2. Wait for admin verification
3. Access marketplace once verified
4. Upload resources (pending approval)
5. Earn points from approved uploads

### Admin Workflow
1. Login via Admin panel
2. Review pending user registrations
3. Approve/Reject users
4. Review uploaded files
5. Approve/Reject files (awards 50 pts to uploader)

## 🔒 Security Features

- Authentication via Supabase Auth
- Email confirmation (auto-enabled for prototype)
- Admin role-based access control
- Protected API routes
- Password reset functionality
- Secure session management

## 📊 Reward System

- **New User Bonus:** 100 points
- **Upload Approval:** 50 points
- **Payment Methods:** Bkash, Nagad, Credit/Debit Card
- **Exchange Rate:** 1 Point = 1 BDT

## 🛠️ Technical Stack

- **Framework:** React 18+
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Backend:** Supabase (Auth + Functions + Storage)
- **Server:** Deno + Hono
- **Database:** Key-Value Store

## 📱 Navigation

### Student App (5-Tab Bottom Navigation)
1. **Home** - Featured resources, categories, wallet balance
2. **Browse** - Search and filter all resources
3. **Upload** - Submit new academic materials
4. **Wallet** - Manage points, transactions, add funds
5. **Profile** - Account settings, security, feedback

### Admin Panel
- **User Verification Tab** - Approve/reject student registrations
- **File Approval Tab** - Review and approve uploads
- Search and filter functionality
- Real-time status indicators

## ⚠️ Important Notes

1. **Prototype Status:** This is a demonstration prototype
2. **No Production Use:** Not suitable for production without security audits
3. **No Real PII:** Do not collect real student personal information
4. **Test Only:** Use test credentials only
5. **Change Defaults:** Update admin passwords before any deployment

## 📝 Setup Instructions

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed setup guide.

## 🎯 Key Functionalities

✅ Complete authentication system
✅ University email verification requirement
✅ Admin user verification workflow
✅ File upload with admin approval
✅ Points-based reward system
✅ Multi-payment wallet system
✅ Shopping cart with checkout
✅ Resource browsing and search
✅ Category-based filtering
✅ Transaction history
✅ Password reset
✅ User feedback system
✅ Responsive web design
✅ Mobile-optimized navigation

## 🔄 Approval Workflows

### User Verification
```
Student Registers → Pending → Admin Reviews → Approved/Rejected
```

### File Upload
```
Student Uploads → Pending → Admin Reviews → Approved/Rejected
                                          → Award 50 Points (if approved)
```

## 💡 Usage Tips

1. **First Run:** Click "Setup" on login page to initialize sample data
2. **Testing:** Use provided test credentials for both student and admin roles
3. **Verification:** Admin must approve users before they can upload
4. **Uploads:** All files require admin approval before appearing in marketplace
5. **Points:** Users earn points when their uploads are approved

---

**Built with ❤️ for university students**
