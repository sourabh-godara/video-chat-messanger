import nodemailer from "nodemailer";

// ─── Transport ────────────────────────────────────────────────────────────────
// In dev: uses Ethereal (fake SMTP, emails visible at ethereal.email)
// In prod: swap with your real SMTP provider (SendGrid, Resend, SES, etc.)

function createTransport() {
    if (process.env.NODE_ENV === "production") {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
        });
    }

    // Dev: log to console + use Ethereal
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: process.env.ETHEREAL_USER ?? "test@ethereal.email",
            pass: process.env.ETHEREAL_PASS ?? "testpassword",
        },
    });
}

const transporter = createTransport();

// ─── Emails ───────────────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
    email: string,
    resetUrl: string
): Promise<void> {
    const info = await transporter.sendMail({
        from: `"ChatterBox" <${process.env.EMAIL_FROM ?? "noreply@chatterbox.app"}>`,
        to: email,
        subject: "Reset your ChatterBox password",
        text: `Reset your password: ${resetUrl}\n\nThis link expires in 15 minutes.\nIf you didn't request this, ignore this email.`,
        html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; background: #141210; color: #f0e6cc; padding: 2rem; border-radius: 12px;">
        <h2 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Reset your password</h2>
        <p style="color: rgba(240,230,204,0.6); margin-bottom: 1.5rem; font-size: 0.9rem;">
          Click the button below to reset your ChatterBox password. This link expires in <strong>15 minutes</strong>.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #d4af5f, #b8962e); color: #1a1508; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">
          Reset password
        </a>
        <p style="margin-top: 1.5rem; font-size: 0.78rem; color: rgba(240,230,204,0.3);">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
    });

    // In dev, log the Ethereal preview URL so you can see the email
    if (process.env.NODE_ENV !== "production") {
        console.log("📧 Password reset email preview:", nodemailer.getTestMessageUrl(info));
    }
}