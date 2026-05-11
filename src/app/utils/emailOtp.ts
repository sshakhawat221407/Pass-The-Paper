/**
 * Email OTP Service using EmailJS SDK
 * Keys: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 *
 * EmailJS template must have these variables:
 *   {{to_email}}  {{to_name}}  {{otp_code}}  {{expiry_minutes}}
 */

const OTP_STORAGE_KEY = 'ptp_registration_otp';
const OTP_EXPIRY_MINUTES = 10;

type StoredOtp = { email: string; otp: string; expiresAt: number };

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOtp(email: string, otp: string): void {
  sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify({
    email, otp, expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  }));
}

export function verifyOtp(email: string, entered: string): boolean {
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) return false;
    const data: StoredOtp = JSON.parse(raw);
    if (data.email !== email) return false;
    if (data.expiresAt < Date.now()) return false;
    return data.otp === entered;
  } catch { return false; }
}

export function clearOtp(): void {
  sessionStorage.removeItem(OTP_STORAGE_KEY);
}

export async function sendOtpEmail(email: string, name: string): Promise<void> {
  const otp = generateOtp();
  saveOtp(email, otp);

  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey) {
    // Dynamically load EmailJS SDK to avoid CORS issues with raw fetch
    const emailjs = await loadEmailJS(publicKey);

    try {
      const result = await emailjs.send(serviceId, templateId, {
        to_email:       email,
        to_name:        name || 'Student',
        user_name:      name || 'Student',
        otp_code:       otp,
        expiry_minutes: String(OTP_EXPIRY_MINUTES),
        from_name:      'Pass The Paper',
      });

      if (result.status === 200) {
        console.log('[EmailJS] OTP sent successfully to', email);
        return;
      }
      throw new Error(`EmailJS status ${result.status}: ${result.text}`);
    } catch (err: any) {
      console.error('[EmailJS] Send failed:', err);
      throw new Error(err?.text || err?.message || 'Failed to send OTP email');
    }
  }

  // Dev fallback
  console.log(
    `%c[DEV] OTP for ${email} → ${otp}`,
    'background:#E56E20;color:#fff;font-size:14px;padding:4px 10px;border-radius:6px;font-weight:bold;'
  );
}

/** Loads EmailJS browser SDK once via CDN and returns the init'd instance */
let emailJSInstance: any = null;

async function loadEmailJS(publicKey: string): Promise<any> {
  if (emailJSInstance) return emailJSInstance;

  // Check if already loaded on window
  if ((window as any).emailjs) {
    (window as any).emailjs.init(publicKey);
    emailJSInstance = (window as any).emailjs;
    return emailJSInstance;
  }

  // Load from CDN
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(script);
  });

  (window as any).emailjs.init(publicKey);
  emailJSInstance = (window as any).emailjs;
  return emailJSInstance;
}
