import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MembershipPlan = 'free' | 'premium_monthly' | 'premium_yearly';

export type User = {
  id: string;
  email: string;
  name: string;
  university: string;
  isVerified: boolean;
  isAdmin: boolean;
  studentId?: string;
  walletBalance: number; // BDT in wallet (only shown after admin approves topup)
  pendingBalance?: number; // BDT pending admin approval
  password?: string;
  profilePicture?: string; // Base64 or URL
  rewardPoints: number; // Points earned from uploads
  membershipType?: MembershipPlan;
  membershipExpiry?: string;
  isBanned?: boolean;
  banReason?: string;
  idCardImage?: string; // Base64 ID card image
  idCardStatus?: 'none' | 'pending' | 'approved' | 'rejected'; // ID verification status
  sellerRating?: number;
  totalRatings?: number;
  restrictions?: {
    canUpload?: boolean;
    canPurchase?: boolean;
    canComment?: boolean;
  };
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'money' | 'points';
  uploadedBy: string;
  uploaderName: string;
  downloads: number;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  createdAt: string;
  department?: string;
  course?: string;
  semester?: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: 'add' | 'purchase' | 'upload_reward' | 'withdrawal' | 'topup_points' | 'membership';
  amount: number;
  currency: 'BDT' | 'Points';
  description: string;
  paymentMethod?: 'Bkash' | 'Nagad' | 'Card' | 'Bank Transfer' | 'Wallet';
  status?: 'pending' | 'approved' | 'rejected'; // for add/withdrawal, admin must approve
  pointsTopupRate?: number; // BDT per point used for topup
  paymentPhone?: string;
  transactionNumber?: string;
  membershipPlan?: Exclude<MembershipPlan, 'free'>;
  relatedId?: string;
  createdAt: string;
};

export type CartItem = {
  resourceId: string;
  userId: string;
  addedAt: string;
};

export type Purchase = {
  id: string;
  userId: string;
  resourceId: string;
  price: number;
  priceType: 'money' | 'points';
  purchasedAt: string;
  paymentMethod?: 'Bkash' | 'Nagad' | 'Card' | 'Wallet';
  feedback?: string;
  rating?: number;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'purchase' | 'sale' | 'system' | 'feedback';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // Can be resourceId, purchaseId, etc.
};

export type Feedback = {
  id: string;
  userId: string;
  type: 'system' | 'item';
  rating: number;
  comment: string;
  itemId?: string; // resourceId if feedback is for an item
  itemTitle?: string;
  createdAt: string;
  updatedAt?: string;
};

export type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  method: 'Bkash' | 'Nagad' | 'Bank Transfer';
  accountNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  completedAt?: string;
};

export type Appeal = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  adminResponse?: string;
};

export type Log = {
  id: string;
  type: 'user_action' | 'admin_action' | 'transaction' | 'verification' | 'system';
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  targetUserId?: string;
  targetUserName?: string;
  metadata?: Record<string, any>;
  createdAt: string;
};

type MockDataContextType = {
  currentUser: User | null;
  users: User[];
  resources: Resource[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  cartItems: CartItem[];
  purchases: Purchase[];
  notifications: Notification[];
  feedbacks: Feedback[];
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, university: string, studentId: string) => Promise<void>;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  verifyUser: (userId: string, approve: boolean) => void;
  removeUserVerification: (userId: string, reason: string) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  setUserRestrictions: (userId: string, restrictions: Partial<User['restrictions']>) => void;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'downloads' | 'rating'>) => void;
  approveFile: (fileId: string, approve: boolean) => void;
  deleteResource: (resourceId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  getResourcesByCategory: (category?: string) => Resource[];
  getPendingUsers: () => User[];
  getPendingFiles: () => Resource[];
  getAllUsers: () => User[];
  getFeaturedResources: () => Resource[];
  addToCart: (resourceId: string) => void;
  removeFromCart: (resourceId: string) => void;
  getCartItems: () => Resource[];
  purchaseFromCart: (paymentMethod: 'wallet' | 'points' | 'Wallet' | 'Bkash' | 'Nagad' | 'Card', useRewardPoints: boolean) => Promise<void>;
  getUserPurchases: () => Purchase[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  getNotifications: () => Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  deleteAllNotifications: () => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  getFeedbacks: () => Feedback[];
  addWithdrawal: (withdrawal: Omit<Withdrawal, 'id' | 'createdAt'>) => Withdrawal;
  getWithdrawals: () => Withdrawal[];
  topupPoints: (userId: string, points: number, bdtCost: number) => void;
  approveTransaction: (txnId: string) => void;
  rejectTransaction: (txnId: string) => void;
  getAllTransactions: () => Transaction[];
  uploadIdCard: (userId: string, imageBase64: string) => void;
  approveIdCard: (userId: string) => void;
  rejectIdCard: (userId: string) => void;
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string) => void;
  getSellerRating: () => number;
  getSellerRatingDetails: (userId?: string) => { rating: number; total: number };
  addAppeal: (appeal: Omit<Appeal, 'id' | 'createdAt' | 'status'>) => void;
  getAppeals: () => Appeal[];
  getAllAppeals: () => Appeal[];
  reviewAppeal: (appealId: string, approve: boolean, adminResponse?: string) => void;
  cancelWithdrawal: (withdrawalId: string) => void;
  logs: Log[];
  addLog: (log: Omit<Log, 'id' | 'createdAt'>) => void;
  getAllLogs: () => Log[];
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const initialUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@passthepaper.com',
    password: 'admin123',
    name: 'Admin User',
    university: 'Pass The Paper',
    isVerified: true,
    isAdmin: true,
    walletBalance: 0,
    rewardPoints: 0,
    membershipType: 'free',
  },
  {
    id: 'user-1',
    email: 'student@university.edu',
    password: 'student123',
    name: 'Nuhash',
    university: 'United International University',
    isVerified: true,
    isAdmin: false,
    studentId: '011221407',
    walletBalance: 500,
    rewardPoints: 1250,
    membershipType: 'free',
  },
  {
    id: 'user-2',
    email: 'jane@university.edu',
    password: 'student123',
    name: 'Jane Smith',
    university: 'Example University',
    isVerified: false,
    isAdmin: false,
    studentId: 'STU002',
    walletBalance: 100,
    rewardPoints: 50,
    membershipType: 'free',
  },
];

const initialResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Data Structures Final Exam 2023',
    description: 'Complete final exam with solutions from Data Structures course.',
    category: 'Previous Papers',
    price: 50,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 45,
    rating: 4.5,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-15').toISOString(),
    department: 'Computer Science',
    course: 'CSE 201',
    semester: 'Fall 2023',
  },
  {
    id: 'res-2',
    title: 'Operating Systems Lecture Notes',
    description: 'Comprehensive lecture notes covering all OS concepts.',
    category: 'Lecture Notes',
    price: 30,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 32,
    rating: 4.8,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-10').toISOString(),
    department: 'Computer Science',
    course: 'CSE 301',
    semester: 'Spring 2024',
  },
  {
    id: 'res-3',
    title: 'Database Management Assignment Solutions',
    description: 'Solutions to all database assignment problems.',
    category: 'Assignments',
    price: 40,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 28,
    rating: 4.7,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-20').toISOString(),
    department: 'Computer Science',
    course: 'CSE 303',
    semester: 'Fall 2023',
  },
  {
    id: 'res-4',
    title: 'Algorithms Midterm 2024',
    description: 'Latest algorithms midterm exam paper.',
    category: 'Previous Papers',
    price: 45,
    priceType: 'points',
    uploadedBy: 'user-2',
    uploaderName: 'Jane Smith',
    downloads: 0,
    rating: 0,
    status: 'pending',
    fileUrl: '#',
    createdAt: new Date().toISOString(),
    department: 'Computer Science',
    course: 'CSE 401',
    semester: 'Spring 2024',
  },
  {
    id: 'res-5',
    title: 'Web Development Study Guide',
    description: 'Complete study guide for web development course.',
    category: 'Study Guides',
    price: 0,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 67,
    rating: 4.9,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-05').toISOString(),
    department: 'Computer Science',
    course: 'CSE 350',
    semester: 'Summer 2024',
  },
  {
    id: 'res-6',
    title: 'Introduction to Algorithms (CLRS)',
    description: 'Classic algorithms textbook in excellent condition.',
    category: 'Books',
    price: 450,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 12,
    rating: 4.6,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-12').toISOString(),
    department: 'Computer Science',
    course: 'CSE 401',
    semester: 'Available',
  },
  {
    id: 'res-7',
    title: 'Arduino Uno R3 Board',
    description: 'Authentic Arduino board with USB cable included.',
    category: 'Electronic Equipment',
    price: 850,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 8,
    rating: 5.0,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-18').toISOString(),
    department: 'Electrical Engineering',
    course: 'EEE 101',
    semester: 'Available',
  },
  {
    id: 'res-8',
    title: 'Calculus II Complete Notes',
    description: 'Comprehensive calculus notes with examples.',
    category: 'Lecture Notes',
    price: 120,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 23,
    rating: 4.4,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-08').toISOString(),
    department: 'Mathematics',
    course: 'MATH 202',
    semester: 'Spring 2024',
  },
  {
    id: 'res-9',
    title: 'Physics Lab Reports Collection',
    description: 'Complete set of physics lab reports.',
    category: 'Assignments',
    price: 200,
    priceType: 'points',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 15,
    rating: 4.3,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-14').toISOString(),
    department: 'Physics',
    course: 'PHY 201',
    semester: 'Fall 2023',
  },
  {
    id: 'res-10',
    title: 'Raspberry Pi 4 Model B (4GB RAM)',
    description: 'Powerful single-board computer with accessories.',
    category: 'Electronic Equipment',
    price: 5200,
    priceType: 'money',
    uploadedBy: 'user-2',
    uploaderName: 'Jane Smith',
    downloads: 3,
    rating: 4.8,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-22').toISOString(),
    department: 'Electrical Engineering',
    course: 'EEE 301',
    semester: 'Available',
  },
  {
    id: 'res-11',
    title: 'Organic Chemistry Study Guide',
    description: 'Comprehensive organic chemistry review.',
    category: 'Study Guides',
    price: 80,
    priceType: 'money',
    uploadedBy: 'user-1',
    uploaderName: 'Nuhash',
    downloads: 19,
    rating: 4.5,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-11').toISOString(),
    department: 'Chemistry',
    course: 'CHE 301',
    semester: 'Spring 2024',
  },
  {
    id: 'res-12',
    title: 'Discrete Mathematics Textbook',
    description: 'Standard discrete math textbook, good condition.',
    category: 'Books',
    price: 380,
    priceType: 'money',
    uploadedBy: 'user-2',
    uploaderName: 'Jane Smith',
    downloads: 7,
    rating: 4.2,
    status: 'approved',
    fileUrl: '#',
    createdAt: new Date('2024-01-16').toISOString(),
    department: 'Mathematics',
    course: 'MATH 250',
    semester: 'Available',
  },
];

const initialTransactions: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-1',
    type: 'add',
    amount: 500,
    currency: 'BDT',
    description: 'Initial wallet balance',
    status: 'approved',
    createdAt: new Date('2024-01-01').toISOString(),
  },
];

const initialPurchases: Purchase[] = [
  // Mock purchases with ratings for testing seller rating
  {
    id: 'pur-1',
    userId: 'user-2',
    resourceId: 'res-1',
    price: 50,
    priceType: 'points',
    purchasedAt: new Date('2024-01-20').toISOString(),
    paymentMethod: 'Wallet',
    feedback: 'Great resource! Very helpful for my exam preparation.',
    rating: 5,
  },
  {
    id: 'pur-2',
    userId: 'user-2',
    resourceId: 'res-2',
    price: 30,
    priceType: 'money',
    purchasedAt: new Date('2024-01-21').toISOString(),
    paymentMethod: 'Bkash',
    feedback: 'Good notes, well organized.',
    rating: 4,
  },
  {
    id: 'pur-3',
    userId: 'user-2',
    resourceId: 'res-3',
    price: 40,
    priceType: 'money',
    purchasedAt: new Date('2024-01-22').toISOString(),
    paymentMethod: 'Nagad',
    feedback: 'Excellent solutions, worth the price.',
    rating: 5,
  },
];

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  // Initialize data from localStorage or use defaults
  useEffect(() => {
    // Version control for data updates - increment this when you update initial data
    const DATA_VERSION = '3.0';
    const storedVersion = localStorage.getItem('ptp_data_version');
    
    // If version mismatch, clear old data and use new initial data
    if (storedVersion !== DATA_VERSION) {
      localStorage.removeItem('ptp_users');
      localStorage.removeItem('ptp_resources');
      localStorage.removeItem('ptp_transactions');
      localStorage.removeItem('ptp_purchases');
      localStorage.removeItem('ptp_notifications');
      localStorage.removeItem('ptp_feedbacks');
      localStorage.removeItem('ptp_withdrawals');
      localStorage.removeItem('ptp_appeals');
      localStorage.removeItem('ptp_logs');
      localStorage.removeItem('ptp_current_user');
      localStorage.setItem('ptp_data_version', DATA_VERSION);
    }
    
    const storedUsers = localStorage.getItem('ptp_users');
    const storedResources = localStorage.getItem('ptp_resources');
    const storedTransactions = localStorage.getItem('ptp_transactions');
    const storedPurchases = localStorage.getItem('ptp_purchases');
    const storedNotifications = localStorage.getItem('ptp_notifications');
    const storedFeedbacks = localStorage.getItem('ptp_feedbacks');
    const storedWithdrawals = localStorage.getItem('ptp_withdrawals');
    const storedAppeals = localStorage.getItem('ptp_appeals');
    const storedLogs = localStorage.getItem('ptp_logs');
    const storedCurrentUser = localStorage.getItem('ptp_current_user');

    setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
    setResources(storedResources ? JSON.parse(storedResources) : initialResources);
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : initialTransactions);
    setPurchases(storedPurchases ? JSON.parse(storedPurchases) : initialPurchases);
    setNotifications(storedNotifications ? JSON.parse(storedNotifications) : []);
    setFeedbacks(storedFeedbacks ? JSON.parse(storedFeedbacks) : []);
    setWithdrawals(storedWithdrawals ? JSON.parse(storedWithdrawals) : []);
    setAppeals(storedAppeals ? JSON.parse(storedAppeals) : []);
    setLogs(storedLogs ? JSON.parse(storedLogs) : []);
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ptp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ptp_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('ptp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ptp_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('ptp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ptp_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('ptp_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('ptp_appeals', JSON.stringify(appeals));
  }, [appeals]);

  useEffect(() => {
    localStorage.setItem('ptp_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ptp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ptp_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const user = users.find(u => u.email === email && u.password === password && !u.isAdmin);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    setCurrentUser(user);
    addLog({ type: 'user_action', action: 'LOGIN', description: `User logged in`, userId: user.id, userName: user.name });
    return user;
  };

  const adminLogin = async (email: string, password: string): Promise<User> => {
    const user = users.find(u => u.email === email && u.password === password && u.isAdmin);
    if (!user) {
      throw new Error('Invalid admin credentials');
    }
    setCurrentUser(user);
    addLog({ type: 'admin_action', action: 'ADMIN_LOGIN', description: `Admin logged in`, userId: user.id, userName: user.name });
    return user;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    university: string,
    studentId: string
  ): Promise<void> => {
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      university,
      studentId,
      isVerified: false,
      isAdmin: false,
      walletBalance: 0,
      pendingBalance: 0,
      rewardPoints: 0,
      membershipType: 'free',
      idCardStatus: 'none',
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    addLog({ type: 'user_action', action: 'REGISTER', description: `New user registered: ${name} (${email}) from ${university}`, userId: newUser.id, userName: name });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const getMembershipUpdates = (plan: MembershipPlan): Partial<User> => {
    if (plan === 'free') {
      return { membershipType: 'free', membershipExpiry: undefined };
    }

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + (plan === 'premium_yearly' ? 12 : 1));

    return {
      membershipType: plan,
      membershipExpiry: expiry.toISOString(),
    };
  };

  const applyMembershipPlan = (userId: string, plan: MembershipPlan) => {
    updateUser(userId, getMembershipUpdates(plan));
  };

  const verifyUser = (userId: string, approve: boolean) => {
    updateUser(userId, { isVerified: approve });
  };

  const removeUserVerification = (userId: string, reason: string) => {
    updateUser(userId, {
      isVerified: false,
      idCardStatus: 'none',
      idCardImage: undefined,
    });

    const newNotification: Notification = {
      id: `not-${Date.now()}`,
      userId,
      type: 'system',
      title: 'Verification Removed',
      message: `Your student verification was removed by admin. Reason: ${reason}. Please upload your ID card and verify again.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const banUser = (userId: string, reason: string) => {
    updateUser(userId, { isBanned: true, banReason: reason });
    
    // Send notification to the banned user
    const newNotification: Notification = {
      id: `not-${Date.now()}`,
      userId: userId,
      type: 'system',
      title: 'Account Banned',
      message: `Your account has been banned. Reason: ${reason}. You can submit an appeal if you believe this was done in error.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const unbanUser = (userId: string) => {
    updateUser(userId, { isBanned: false, banReason: undefined });
  };

  const setUserRestrictions = (userId: string, restrictions: Partial<User['restrictions']>) => {
    updateUser(userId, { restrictions });
  };

  const addResource = (resource: Omit<Resource, 'id' | 'createdAt' | 'downloads' | 'rating'>) => {
    const newResource: Resource = {
      ...resource,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      downloads: 0,
      rating: 0,
    };
    setResources(prev => [...prev, newResource]);
  };

  const approveFile = (fileId: string, approve: boolean) => {
    setResources(prev => prev.map(r => 
      r.id === fileId 
        ? { ...r, status: approve ? 'approved' : 'rejected' } 
        : r
    ));
  };

  const deleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const immediateUser = users.find(u => u.id === transaction.userId);
    if (
      immediateUser &&
      transaction.type === 'membership' &&
      transaction.paymentMethod === 'Wallet' &&
      immediateUser.walletBalance < transaction.amount
    ) {
      throw new Error('Insufficient wallet balance');
    }

    const requiresApproval =
      transaction.type === 'add' ||
      transaction.type === 'withdrawal' ||
      (transaction.type === 'membership' && transaction.paymentMethod !== 'Wallet');

    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: transaction.status || (requiresApproval ? 'pending' : 'approved'),
    };
    setTransactions(prev => [...prev, newTransaction]);

    const user = users.find(u => u.id === transaction.userId);
    if (user) {
      let balanceChange = 0;
      if (transaction.type === 'purchase') balanceChange = -transaction.amount;
      else if (transaction.type === 'upload_reward') balanceChange = transaction.amount;
      else if (transaction.type === 'membership' && newTransaction.status === 'approved') {
        if (transaction.paymentMethod === 'Wallet') {
          if (user.walletBalance < transaction.amount) {
            throw new Error('Insufficient wallet balance');
          }
          updateUser(user.id, {
            ...getMembershipUpdates(transaction.membershipPlan || 'premium_monthly'),
            walletBalance: user.walletBalance - transaction.amount,
          });
        } else {
          applyMembershipPlan(user.id, transaction.membershipPlan || 'premium_monthly');
        }
        return;
      }
      else if (transaction.type === 'topup_points') {
        // deduct BDT immediately for points topup (approved instantly)
        updateUser(user.id, {
          walletBalance: user.walletBalance - (transaction.pointsTopupRate || 0),
          rewardPoints: user.rewardPoints + transaction.amount,
        });
        return;
      }
      // add/withdrawal are PENDING - don't change balance yet
      if (balanceChange !== 0) {
        updateUser(user.id, { walletBalance: user.walletBalance + balanceChange });
      }
    }
  };

  const topupPoints = (userId: string, points: number, bdtCost: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (user.walletBalance < bdtCost) throw new Error('Insufficient BDT balance');
    addTransaction({
      userId,
      type: 'topup_points',
      amount: points,
      currency: 'Points',
      description: `Topped up ${points} points for ৳${bdtCost}`,
      pointsTopupRate: bdtCost,
    });
  };

  const approveTransaction = (txnId: string) => {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn || txn.status !== 'pending') return;

    const user = users.find(u => u.id === txn.userId);
    if (user && txn.type === 'add') {
      updateUser(user.id, { walletBalance: user.walletBalance + txn.amount });
      setNotifications(prev => [...prev, {
        id: `not-${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: 'Wallet Top-up Approved',
        message: `Your BDT ${txn.amount} wallet top-up has been approved.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: txn.id,
      }]);
    }

    if (user && txn.type === 'membership') {
      applyMembershipPlan(user.id, txn.membershipPlan || 'premium_monthly');
      setNotifications(prev => [...prev, {
        id: `not-${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: 'Membership Approved',
        message: `Your ${txn.membershipPlan === 'premium_yearly' ? 'Premium Yearly' : 'Premium Monthly'} membership request has been approved.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: txn.id,
      }]);
    }

    setTransactions(prev => prev.map(t =>
      t.id === txnId ? { ...t, status: 'approved' as const } : t
    ));
  };

  const rejectTransaction = (txnId: string) => {
    const txn = transactions.find(t => t.id === txnId);
    if (txn) {
      setNotifications(prev => [...prev, {
        id: `not-${Date.now()}`,
        userId: txn.userId,
        type: 'system',
        title: txn.type === 'membership' ? 'Membership Request Rejected' : 'Transaction Rejected',
        message: txn.type === 'membership'
          ? 'Your membership payment request was rejected. Please check your payment details and submit again.'
          : `Your transaction request for BDT ${txn.amount} was rejected.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: txn.id,
      }]);
    }
    setTransactions(prev => prev.map(t =>
      t.id === txnId ? { ...t, status: 'rejected' as const } : t
    ));
  };

  const getAllTransactions = (): Transaction[] => transactions;

  const uploadIdCard = (userId: string, imageBase64: string) => {
    updateUser(userId, { idCardImage: imageBase64, idCardStatus: 'pending' });
  };

  const approveIdCard = (userId: string) => {
    const u = users.find(x => x.id === userId);
    updateUser(userId, { idCardStatus: 'approved', isVerified: true });
    addLog({ type: 'admin_action', action: 'ID_CARD_APPROVED', description: `Admin approved ID card for ${u?.name || userId} — user is now verified`, targetUserId: userId, targetUserName: u?.name });
    setNotifications(prev => [...prev, {
      id: `not-${Date.now()}`,
      userId,
      type: 'system',
      title: 'ID Card Approved',
      message: 'Your student ID card has been approved. Your account is verified.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }]);
  };

  const rejectIdCard = (userId: string) => {
    const u = users.find(x => x.id === userId);
    updateUser(userId, { idCardStatus: 'rejected', isVerified: false });
    addLog({ type: 'admin_action', action: 'ID_CARD_REJECTED', description: `Admin rejected ID card for ${u?.name || userId}`, targetUserId: userId, targetUserName: u?.name });
    setNotifications(prev => [...prev, {
      id: `not-${Date.now()}`,
      userId,
      type: 'system',
      title: 'ID Card Rejected',
      message: 'Your student ID card was rejected. Please upload a clear and valid ID card again.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }]);
  };

  const approveWithdrawal = (withdrawalId: string) => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal || withdrawal.status !== 'pending') return;

    const user = users.find(u => u.id === withdrawal.userId);
    if (user) {
      // Balance already deducted when withdrawal was requested, just send notification
      setNotifications(prev => [...prev, {
        id: `not-${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: 'Withdrawal Approved',
        message: `Your BDT ${withdrawal.amount} withdrawal to ${withdrawal.method} has been approved and processed.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: withdrawal.id,
      }]);
      addLog({
        type: 'admin_action',
        action: 'WITHDRAWAL_APPROVED',
        description: `Admin approved withdrawal of ৳${withdrawal.amount} for user ${user.name} via ${withdrawal.method}`,
        targetUserId: user.id,
        targetUserName: user.name,
        metadata: { amount: withdrawal.amount, method: withdrawal.method },
      });
    }

    setWithdrawals(prev => prev.map(w =>
      w.id === withdrawalId
        ? { ...w, status: 'completed' as const, completedAt: new Date().toISOString() }
        : w
    ));
    setTransactions(prev => prev.map(t =>
      (t.relatedId === withdrawalId || (!t.relatedId && t.userId === withdrawal.userId && t.type === 'withdrawal' && t.status === 'pending'))
        ? { ...t, status: 'approved' as const }
        : t
    ));
  };

  const rejectWithdrawal = (withdrawalId: string) => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    setWithdrawals(prev => prev.map(w =>
      w.id === withdrawalId ? { ...w, status: 'rejected' as const } : w
    ));
    if (withdrawal) {
      // Refund balance since it was deducted at request time
      const user = users.find(u => u.id === withdrawal.userId);
      if (user) {
        updateUser(user.id, { walletBalance: user.walletBalance + withdrawal.amount });
        addLog({
          type: 'admin_action',
          action: 'WITHDRAWAL_REJECTED',
          description: `Admin rejected withdrawal of ৳${withdrawal.amount} for user ${user.name}, amount refunded`,
          targetUserId: user.id,
          targetUserName: user.name,
          metadata: { amount: withdrawal.amount, method: withdrawal.method },
        });
      }
      setNotifications(prev => [...prev, {
        id: `not-${Date.now()}`,
        userId: withdrawal.userId,
        type: 'system',
        title: 'Withdrawal Rejected',
        message: `Your BDT ${withdrawal.amount} withdrawal request was rejected. Amount has been refunded to your wallet.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: withdrawal.id,
      }]);
    }
    setTransactions(prev => prev.map(t =>
      (withdrawal && (t.relatedId === withdrawalId || (!t.relatedId && t.userId === withdrawal.userId && t.type === 'withdrawal' && t.status === 'pending')))
        ? { ...t, status: 'rejected' as const }
        : t
    ));
  };

  const getResourcesByCategory = (category?: string): Resource[] => {
    const approvedResources = resources.filter(r => r.status === 'approved');
    if (!category || category === 'All') {
      return approvedResources;
    }
    return approvedResources.filter(r => r.category === category);
  };

  const getPendingUsers = (): User[] => {
    return users.filter(u => !u.isVerified && !u.isAdmin);
  };

  const getPendingFiles = (): Resource[] => {
    return resources;
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  const getFeaturedResources = (): Resource[] => {
    return resources
      .filter(r => r.status === 'approved')
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 6);
  };

  const addToCart = (resourceId: string) => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    const existingItem = cartItems.find(item => item.resourceId === resourceId && item.userId === currentUser.id);
    if (!existingItem) {
      setCartItems(prev => [...prev, { resourceId, userId: currentUser.id, addedAt: new Date().toISOString() }]);
    }
  };

  const removeFromCart = (resourceId: string) => {
    setCartItems(prev => prev.filter(item => item.resourceId !== resourceId || item.userId !== currentUser?.id));
  };

  const getCartItems = (): Resource[] => {
    if (!currentUser) {
      return [];
    }
    return cartItems
      .filter(item => item.userId === currentUser.id)
      .map(item => resources.find(resource => resource.id === item.resourceId) as Resource);
  };

  const purchaseFromCart = async (
    paymentMethod: 'wallet' | 'points' | 'Wallet' | 'Bkash' | 'Nagad' | 'Card',
    useRewardPoints: boolean
  ) => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    const cartResources = getCartItems();
    const normalizedPaymentMethod =
      paymentMethod === 'wallet' || paymentMethod === 'points' ? 'Wallet' : paymentMethod;
    let totalAmount = 0;
    let totalPoints = 0;

    cartResources.forEach(resource => {
      if (resource.priceType === 'money') {
        totalAmount += resource.price;
      } else {
        totalPoints += resource.price;
      }
    });

    // Handle wallet payment - deduct from user's wallet balance and reward points
    if (normalizedPaymentMethod === 'Wallet') {
      if (currentUser.walletBalance < totalAmount) {
        throw new Error('Insufficient wallet balance');
      }
      if (currentUser.rewardPoints < totalPoints) {
        throw new Error('Insufficient reward points');
      }
      
      // Deduct from wallet
      updateUser(currentUser.id, { 
        walletBalance: currentUser.walletBalance - totalAmount,
        rewardPoints: currentUser.rewardPoints - totalPoints
      });
    }
    // For external payment methods (Bkash, Nagad, Card), no deduction needed
    // The payment is processed externally and the purchase is recorded

    const purchasedAt = new Date().toISOString();
    const newPurchases: Purchase[] = cartResources.map((resource, index) => ({
        id: `pur-${Date.now()}-${index}`,
        userId: currentUser.id,
        resourceId: resource.id,
        price: resource.price,
        priceType: resource.priceType,
        purchasedAt,
        paymentMethod: normalizedPaymentMethod,
    }));

    const newTransactions: Transaction[] = cartResources.map((resource, index) => ({
        id: `txn-${Date.now()}-${index}`,
        userId: currentUser.id,
        type: 'purchase',
        amount: resource.price,
        currency: resource.priceType === 'money' ? 'BDT' : 'Points',
        description: `Purchase of ${resource.title}`,
        status: 'approved',
        paymentMethod: normalizedPaymentMethod,
        createdAt: purchasedAt,
    }));

    setPurchases(prev => [...prev, ...newPurchases]);
    setTransactions(prev => [...prev, ...newTransactions]);
    setResources(prev => prev.map(r =>
      cartResources.some(resource => resource.id === r.id)
        ? { ...r, downloads: r.downloads + 1 }
        : r
    ));

    setCartItems(prev => prev.filter(item => item.userId !== currentUser.id));
  };

  const getUserPurchases = (): Purchase[] => {
    if (!currentUser) {
      return [];
    }
    return purchases.filter(purchase => purchase.userId === currentUser.id);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const getNotifications = (): Notification[] => {
    if (!currentUser) {
      return [];
    }
    return notifications.filter(notification => notification.userId === currentUser.id);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const deleteAllNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.id));
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  const getFeedbacks = (): Feedback[] => {
    if (!currentUser) {
      return [];
    }
    return feedbacks.filter(feedback => feedback.userId === currentUser.id);
  };

  const addWithdrawal = (withdrawal: Omit<Withdrawal, 'id' | 'createdAt'>): Withdrawal => {
    const newWithdrawal: Withdrawal = {
      ...withdrawal,
      id: `wd-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWithdrawals(prev => [...prev, newWithdrawal]);
    // Immediately deduct from balance (can be refunded on cancel/reject)
    const user = users.find(u => u.id === withdrawal.userId);
    if (user) {
      updateUser(user.id, { walletBalance: user.walletBalance - withdrawal.amount });
      addLog({
        type: 'transaction',
        action: 'WITHDRAWAL_REQUESTED',
        description: `User requested withdrawal of ৳${withdrawal.amount} via ${withdrawal.method} to ${withdrawal.accountNumber}`,
        userId: user.id,
        userName: user.name,
        metadata: { amount: withdrawal.amount, method: withdrawal.method, accountNumber: withdrawal.accountNumber },
      });
    }
    return newWithdrawal;
  };

  const getWithdrawals = (): Withdrawal[] => {
    if (!currentUser) {
      return [];
    }
    return withdrawals.filter(withdrawal => withdrawal.userId === currentUser.id);
  };

  const getSellerRatingDetails = (userId?: string): { rating: number; total: number } => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      return { rating: 0, total: 0 };
    }

    const userUploads = resources.filter(r => r.uploadedBy === targetUserId);
    const uploadIds = userUploads.map(u => u.id);

    const itemFeedbackRatings = feedbacks
      .filter(f => f.type === 'item' && f.itemId && uploadIds.includes(f.itemId) && f.rating > 0)
      .map(f => f.rating);

    const purchaseRatings = purchases
      .filter(p => uploadIds.includes(p.resourceId) && p.rating !== undefined)
      .map(p => p.rating || 0);

    const ratings = [...itemFeedbackRatings, ...purchaseRatings].filter(rating => rating > 0);

    if (ratings.length === 0) {
      return { rating: 0, total: 0 };
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    return {
      rating: Number((totalRating / ratings.length).toFixed(1)),
      total: ratings.length,
    };
  };

  const getSellerRating = (): number => {
    return getSellerRatingDetails().rating;
  };

  const addLog = (log: Omit<Log, 'id' | 'createdAt'>) => {
    const newLog: Log = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 500)); // keep last 500 logs
  };

  const getAllLogs = (): Log[] => logs;

  const cancelWithdrawal = (withdrawalId: string) => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal || withdrawal.status !== 'pending') return;

    const user = users.find(u => u.id === withdrawal.userId);
    if (user) {
      // Refund the balance that was deducted on withdrawal request
      updateUser(user.id, { walletBalance: user.walletBalance + withdrawal.amount });
      setNotifications(prev => [...prev, {
        id: `not-${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: 'Withdrawal Cancelled',
        message: `Your BDT ${withdrawal.amount} withdrawal request has been cancelled. Amount refunded to your wallet.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: withdrawal.id,
      }]);
      addLog({
        type: 'transaction',
        action: 'WITHDRAWAL_CANCELLED',
        description: `User cancelled withdrawal of ৳${withdrawal.amount} via ${withdrawal.method}`,
        userId: user.id,
        userName: user.name,
        metadata: { amount: withdrawal.amount, method: withdrawal.method, withdrawalId },
      });
    }

    setWithdrawals(prev => prev.map(w =>
      w.id === withdrawalId ? { ...w, status: 'rejected' as const } : w
    ));
    setTransactions(prev => prev.map(t =>
      (withdrawal && t.relatedId === withdrawalId)
        ? { ...t, status: 'rejected' as const } : t
    ));
  };

  const addAppeal = (appeal: Omit<Appeal, 'id' | 'createdAt' | 'status'>) => {
    const newAppeal: Appeal = {
      ...appeal,
      id: `ap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setAppeals(prev => [...prev, newAppeal]);
  };

  const getAppeals = (): Appeal[] => {
    if (!currentUser) {
      return [];
    }
    return appeals.filter(appeal => appeal.userId === currentUser.id);
  };

  const getAllAppeals = (): Appeal[] => {
    return appeals;
  };

  const reviewAppeal = (appealId: string, approve: boolean, adminResponse?: string) => {
    const appeal = appeals.find(a => a.id === appealId);
    
    setAppeals(prev => prev.map(a => 
      a.id === appealId 
        ? { ...a, status: approve ? 'approved' : 'rejected', reviewedAt: new Date().toISOString(), adminResponse } 
        : a
    ));
    
    // If appeal is approved, unban the user
    if (approve && appeal) {
      unbanUser(appeal.userId);
      
      // Send notification to the user
      const newNotification: Notification = {
        id: `not-${Date.now()}`,
        userId: appeal.userId,
        type: 'system',
        title: 'Appeal Approved',
        message: `Your appeal has been approved. Your account has been unbanned. ${adminResponse ? 'Admin response: ' + adminResponse : ''}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [...prev, newNotification]);
    } else if (!approve && appeal) {
      // Send rejection notification
      const newNotification: Notification = {
        id: `not-${Date.now()}`,
        userId: appeal.userId,
        type: 'system',
        title: 'Appeal Rejected',
        message: `Your appeal has been rejected. ${adminResponse ? 'Admin response: ' + adminResponse : ''}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  return (
    <MockDataContext.Provider
      value={{
        currentUser,
        users,
        resources,
        transactions,
        withdrawals,
        cartItems,
        purchases,
        notifications,
        feedbacks,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
        verifyUser,
        removeUserVerification,
        banUser,
        unbanUser,
        setUserRestrictions,
        addResource,
        approveFile,
        deleteResource,
        addTransaction,
        getResourcesByCategory,
        getPendingUsers,
        getPendingFiles,
        getAllUsers,
        getFeaturedResources,
        addToCart,
        removeFromCart,
        getCartItems,
        purchaseFromCart,
        getUserPurchases,
        addNotification,
        getNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        deleteAllNotifications,
        addFeedback,
        getFeedbacks,
        addWithdrawal,
        getWithdrawals,
        topupPoints,
        approveTransaction,
        rejectTransaction,
        getAllTransactions,
        uploadIdCard,
        approveIdCard,
        rejectIdCard,
        approveWithdrawal,
        rejectWithdrawal,
        getSellerRating,
        getSellerRatingDetails,
        addAppeal,
        getAppeals,
        getAllAppeals,
        reviewAppeal,
        cancelWithdrawal,
        logs,
        addLog,
        getAllLogs,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}
