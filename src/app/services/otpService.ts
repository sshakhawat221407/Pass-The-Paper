const OTP_STORAGE_KEY = 'ptp_registration_otp';
const OTP_EXPIRY_MINUTES = 10;

type StoredOtp = {
  email: string;
  otp: string;
  expiresAt: number;
};

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveDevelopmentOtp(email: string, otp: string) {
  const payload: StoredOtp = {
    email,
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  };

  sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(payload));
}

function getDevelopmentOtp() {
  const storedOtp = sessionStorage.getItem(OTP_STORAGE_KEY);
  if (!storedOtp) {
    return null;
  }

  try {
    return JSON.parse(storedOtp) as StoredOtp;
  } catch {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return null;
  }
}

export async function requestRegistrationOtp(email: string) {
  try {
    const response = await fetch('/api/auth/request-registration-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      return;
    }
  } catch {
    // Local demo fallback below. A production app should send OTPs from the server.
  }

  const otp = generateOtp();
  saveDevelopmentOtp(email, otp);
  console.info(`Development registration OTP for ${email}: ${otp}`);
}

export async function verifyRegistrationOtp(email: string, otp: string) {
  try {
    const response = await fetch('/api/auth/verify-registration-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (response.ok) {
      return true;
    }

    if (response.status === 400 || response.status === 401) {
      return false;
    }
  } catch {
    // Local demo fallback below. Server verification is required for real security.
  }

  const storedOtp = getDevelopmentOtp();
  if (!storedOtp || storedOtp.email !== email || storedOtp.expiresAt < Date.now()) {
    return false;
  }

  return storedOtp.otp === otp;
}

export function clearRegistrationOtp() {
  sessionStorage.removeItem(OTP_STORAGE_KEY);
}
