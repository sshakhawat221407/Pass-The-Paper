# Pass The Paper - Web Application

A university student-only academic resource marketplace where verified students can access, upload, donate, and exchange academic resources.

## 🎯 Features

### Student Features
- **University Email Verification**: Students must verify with their university email
- **Browse & Search**: Search and filter academic resources (PYQs, notes, assignments)
- **Upload & Share**: Upload resources and earn reward points
- **Wallet System**: Built-in wallet with Bkash/Nagad/Card payment integration
- **Cart & Checkout**: Add items to cart and purchase with multiple payment methods
- **Purchase History**: Track all purchased and uploaded resources
- **Ratings & Reviews**: Rate and review resources
- **Membership Tiers**: Premium membership options
- **Notifications**: Real-time notifications for purchases, uploads, and approvals
- **Profile Management**: Edit profile, change password, manage settings
- **Bill Generation**: Download purchase receipts as PDF

### Admin Features
- **Separate Admin Login**: Dedicated admin authentication
- **User Verification**: Approve/reject student verification requests
- **File Approval**: Review and approve uploaded academic resources
- **User Management**: Ban/unban users with reasons
- **Appeals Management**: Review and approve/reject user ban appeals
- **Dashboard Analytics**: Track platform statistics and activity

### Ban & Appeals System
- Banned users are completely restricted from platform functionality
- Users receive notifications with ban reasons
- Appeal system allows users to contest bans
- Admins can review and approve/reject appeals

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Animations**: Motion (Framer Motion)
- **Build Tool**: Vite 6.3.5

## 🎨 Color Palette

- Primary Orange: `#E56E20`
- Background Cream: `#F0D7C7`
- Card Blue: `#D4ECF7`

## 📂 Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Main application component
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── screens/           # Screen components
│   │   ├── Home.tsx           # Home page
│   │   ├── Browse.tsx         # Browse resources
│   │   ├── Upload.tsx         # Upload resources
│   │   ├── Wallet.tsx         # Wallet page
│   │   ├── Profile.tsx        # User profile
│   │   ├── Login.tsx          # Student login
│   │   ├── Register.tsx       # Student registration
│   │   ├── AdminLogin.tsx     # Admin login
│   │   └── AdminDashboardEnhanced.tsx  # Admin panel
│   └── utils/
│       └── MockDataContext.tsx  # Mock data provider
└── styles/
    ├── globals.css
    ├── index.css
    └── default_theme.css
```

## 🚀 Installation

1. **Install dependencies** (requires pnpm):
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm run dev
   ```

3. **Build for production**:
   ```bash
   pnpm run build
   ```

## 👥 Mock Data & Testing

The application uses a mock data context for development and testing. Here are the pre-configured accounts:

### Student Accounts
- Email: `student@university.edu`
- Password: `password123`

### Admin Account
- Email: `admin@passthepaper.com`
- Password: `admin123`

## 📦 Key Components

### Student Layout
- **Header**: Logo, search, cart, notifications
- **Navigation**: Bottom tab bar (Home, Browse, Upload, Wallet, Profile)
- **Responsive**: Mobile-first design

### Admin Dashboard
- **Users Tab**: Verify student accounts
- **Files Tab**: Approve uploaded resources
- **Banned Users Tab**: Manage banned users
- **Appeals Tab**: Review ban appeals

### Screens
- `CartPageScreen`: Shopping cart
- `CheckoutPageScreen`: Payment processing
- `NotificationsPageScreen`: User notifications
- `MembershipPageScreen`: Premium tiers
- `HistoryScreen`: Purchase and upload history
- `FeedbackScreen`: User feedback
- `EditProfileScreen`: Profile editing
- `SettingsScreen`: Account settings
- `BannedUserScreen`: Ban appeal submission

## 💳 Payment Integration

The application supports three payment methods:
- **Bkash**: Mobile financial service
- **Nagad**: Mobile financial service  
- **Card**: Credit/debit card payments

*Note: Payment integrations are currently mocked for development.*

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions including:
- Vercel deployment (recommended)
- Netlify deployment
- Traditional hosting (Apache/Nginx)
- Backend integration (Supabase)
- Payment gateway setup
- Email service configuration

## 🔜 Future Enhancements

- Real payment gateway integration
- Real-time database (Supabase/Firebase)
- File upload to cloud storage
- Email notification system
- Advanced search with filters
- Resource recommendations
- Chat/messaging between users
- Mobile apps (React Native)

## 📄 License

Private - University Academic Resource Platform

## 👨‍💻 Author

**GitHub**: [@sshakhawat221407](https://github.com/sshakhawat221407)

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for Academic Resource Sharing
