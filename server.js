const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// =============================================
// 🔧 CONFIGURE YOUR EMAIL SETTINGS HERE
// =============================================
// To get real email notifications, set these environment variables
// or replace the values below with your SMTP credentials.
//
// For Gmail: Use an App Password (not your regular password)
//   1. Enable 2FA on your Google account
//   2. Go to https://myaccount.google.com/apppasswords
//   3. Create an app password for "Mail"
//   4. Use that password below
//
// For testing: Leave as-is to use Ethereal (catches emails in a test inbox)

const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER || 'YOUR_EMAIL@gmail.com',
    pass: process.env.SMTP_PASS || 'YOUR_APP_PASSWORD'
  }
};

// The email address that sends the notification
const FROM_EMAIL = process.env.FROM_EMAIL || EMAIL_CONFIG.auth.user;

// =============================================
// API: Send notification when someone says Yes
// =============================================
app.post('/api/notify', async (req, res) => {
  const { recipientName, customMessage, creatorEmail, respondentName } = req.body;

  if (!creatorEmail) {
    return res.status(400).json({ error: 'Creator email is required' });
  }

  try {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    const mailOptions = {
      from: FROM_EMAIL,
      to: creatorEmail,
      subject: `🎉 Someone said YES! - CSE Fun`,
      html: `
        <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #fce4ec, #f3e5f5); border-radius: 20px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 10px;">🎉🐱💀🎀</div>
          <h1 style="color: #e91e63; font-size: 1.8rem; margin-bottom: 10px;">YAAAY! Someone said YES!</h1>
          <div style="background: white; border-radius: 16px; padding: 20px; margin: 20px 0;">
            <p style="font-size: 1.2rem; color: #6a1b9a;"><strong>${respondentName || 'Someone'}</strong> clicked <strong style="color: #4CAF50;">YES! 🎉</strong></p>
            <div style="border-top: 2px dashed #ce93d8; margin: 15px 0;"></div>
            <p style="color: #7b1fa2; font-size: 1rem;"><strong>Your message was:</strong></p>
            <p style="color: #e91e63; font-size: 1.1rem; font-style: italic; background: #fff0f3; padding: 10px; border-radius: 10px;">${customMessage || 'Will you go out with me? 🎀'}</p>
            <p style="color: #7b1fa2; font-size: 0.9rem; margin-top: 10px;">Sent to: <strong>${recipientName}</strong></p>
          </div>
          <p style="color: #ce93d8; font-size: 0.8rem;">🎀 CSE Fun — made with 💖 🎀</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Also try to send via Ethereal for a test preview if using default config
    res.json({ success: true, message: 'Notification sent!' });
  } catch (error) {
    console.error('Email error:', error.message);

    // If real email fails, try Ethereal as fallback for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const testMailOptions = {
        from: '"CSE Fun" <noreply@csefun.dev>',
        to: creatorEmail,
        subject: `🎉 Someone said YES! (DEV) - CSE Fun`,
        html: `
          <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #fce4ec, #f3e5f5); border-radius: 20px; text-align: center; border: 2px dashed #e91e63;">
            <div style="font-size: 2rem;">⚠️ DEV MODE ⚠️</div>
            <div style="font-size: 3rem; margin: 10px 0;">🎉🐱💀🎀</div>
            <h1 style="color: #e91e63;">YAAAY! Someone said YES!</h1>
            <p style="font-size: 1.2rem;"><strong>${respondentName || 'Someone'}</strong> clicked YES! 🎉</p>
            <p>Message: <em>${customMessage || 'Will you go out with me? 🎀'}</em></p>
            <p>Sent to: <strong>${recipientName}</strong></p>
            <hr>
            <p style="font-size: 0.8rem; color: #999;">⚠️ This is a dev preview because your SMTP isn't configured.<br>Configure SMTP_HOST, SMTP_USER, and SMTP_PASS env vars to send real emails.</p>
          </div>
        `
      };

      const info = await testTransporter.sendMail(testMailOptions);
      console.log('📧 Dev preview URL:', nodemailer.getTestMessageUrl(info));

      return res.json({
        success: true,
        message: 'Notification sent via dev inbox!',
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
    } catch (fallbackError) {
      return res.status(500).json({
        error: 'Failed to send email',
        details: `Configure SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables. ${error.message}`
      });
    }
  }
});

// Fallback: serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  🎀 CSE Fun Server Running! 🎀
  ─────────────────────────
  📍 Local: http://localhost:${PORT}
  📧 Email notifications: ${EMAIL_CONFIG.auth.user !== 'YOUR_EMAIL@gmail.com' ? '✅ Configured' : '⚠️  Not configured (using dev mode)'}
  
  To configure email, set these env vars:
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_app_password
    FROM_EMAIL=your_email@gmail.com
  `);
});