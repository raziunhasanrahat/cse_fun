const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientName, customMessage, creatorEmail, respondentName } = req.body;

  if (!creatorEmail) {
    return res.status(400).json({ error: 'Creator email is required' });
  }

  try {
    // Use environment variables set in Vercel dashboard
    const hasRealConfig = process.env.SMTP_USER && process.env.SMTP_PASS &&
      process.env.SMTP_USER !== 'YOUR_EMAIL@gmail.com';

    if (hasRealConfig) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
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
      return res.json({ success: true, message: 'Notification sent!' });
    } else {
      // No SMTP configured — just log it and return success for the game UI
      console.log('🔔 NOTIFICATION (not sent - SMTP not configured):', {
        to: creatorEmail,
        respondentName,
        recipientName,
        customMessage
      });
      return res.json({
        success: true,
        message: 'Notification logged (configure SMTP in Vercel env vars for real emails)',
        info: 'Set SMTP_USER, SMTP_PASS, SMTP_HOST in Vercel dashboard → Settings → Environment Variables'
      });
    }
  } catch (error) {
    console.error('Email error:', error.message);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
};