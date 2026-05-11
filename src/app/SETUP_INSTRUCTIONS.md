# Pass The Paper - Setup Instructions

## Quick Start

### First-Time Setup

1. **Access the Setup Page**: On the login screen, click the "Setup" link at the bottom
2. **Initialize Data**: Click "Initialize Application" to create:
   - Admin account
   - Sample student accounts
   - Sample academic resources
3. **Copy Credentials**: Save the test credentials displayed after setup
4. **Start Testing**: Click "Continue to Application" to begin

### Test Credentials (After Setup)

**Admin Account:**
- Email: `admin@passthepaper.com`
- Password: `admin123`

**Student Account:**
- Email: `john@university.edu`
- Password: `student123`

## How to Use

### For Students:
1. **Register**: Create an account with your university email
2. **Wait for Verification**: Admin must approve your account
3. **Browse Resources**: Search and download academic materials
4. **Upload Resources**: Share your own materials (requires verification)
5. **Manage Wallet**: Add funds and earn points from uploads

### For Admins:
1. **Login**: Use the Admin Login option
2. **Verify Users**: Review and approve student registrations
3. **Approve Files**: Review and approve uploaded resources
4. **Award Points**: Approved uploads earn 50 points for the uploader

## Admin Account Setup

### Option 1: Use Setup Page (Recommended)

1. **Access the Setup Page**: On the login screen, click the "Setup" link at the bottom
2. **Initialize Data**: Click "Initialize Application" to create:
   - Admin account
   - Sample student accounts
   - Sample academic resources
3. **Copy Credentials**: Save the test credentials displayed after setup
4. **Start Testing**: Click "Continue to Application" to begin

### Option 2: Create Admin via Registration

1. Register a new account through the normal registration flow
2. After registration, you need to manually update the user record in the KV store to grant admin privileges
3. Use the Supabase Dashboard or a custom script to set `isAdmin: true` for the user

### Option 3: Manual Admin Creation

You can create an admin user by running this code in your Supabase SQL Editor or via the KV store:

**Example Admin User Data:**
```json
{
  "id": "admin-user-id",
  "email": "admin@passthepaper.com",
  "name": "Admin User",
  "university": "Pass The Paper",
  "isVerified": true,
  "isAdmin": true,
  "walletBalance": 0,
  "createdAt": "2026-01-22T00:00:00.000Z"
}
```

### Test Admin Credentials

For testing purposes, you can create an admin account with:
- Email: `admin@passthepaper.com`
- Password: `admin123` (change this in production!)

### Accessing the Admin Panel

1. Go to the login page
2. Click on "Admin Login"
3. Enter your admin credentials
4. You'll be redirected to the Admin Dashboard

## Features

### User Panel Features:
- Browse and search academic resources
- Upload files (pending admin approval)
- Wallet system with multiple payment methods (Bkash, Nagad, Card)
- Profile management with password reset
- Feedback system

### Admin Panel Features:
- View all pending user registrations
- Approve or reject user verifications
- Review all uploaded files
- Approve or reject file uploads
- Search and filter functionality

## Important Notes

1. **User Verification**: New users must be verified by an admin before they can upload resources
2. **File Approval**: All uploaded files require admin approval before appearing in the marketplace
3. **Reward System**: Users earn 50 points when their uploaded files are approved
4. **Welcome Bonus**: New users receive 100 points upon registration

## Color Scheme

- Primary Orange: `#E56E20`
- Background Peach: `#F0D7C7`
- Card Blue: `#D4ECF7`

## Security Notes

- This is a prototype application and should not be used in production without proper security audits
- Do not collect real PII or sensitive student data
- Change all default admin credentials before deployment
- Implement proper email verification in production