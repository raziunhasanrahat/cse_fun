# 🎀 CSE Fun 💜

An interactive cute game where you send someone a personalized message and they have to answer "Yes!" while the "No" button runs away from them.

## 🚀 Deploy to Vercel (Free)

### One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fraziunhasanrahat%2Fcse_fun)

### Manual deploy:

1. Go to https://vercel.com
2. Click **"Add New" → "Project"**
3. Import your GitHub repo: `raziunhasanrahat/cse_fun`
4. Click **"Deploy"** — it works out of the box!

---

## 📧 Email Notifications (Optional)

When someone clicks "Yes!", you can get an email notification. To enable this:

1. Go to your Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add these variables:

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your-email@gmail.com` |
| `SMTP_PASS` | *(your Gmail App Password)* |
| `FROM_EMAIL` | `your-email@gmail.com` |

3. **For Gmail App Password:** Enable 2FA → go to https://myaccount.google.com/apppasswords → create one for "Mail"

**Without email config, the game still works perfectly!** — The "Yes" response is still logged, you just won't get the email notification.

## 🎮 How to use

1. Open your Vercel URL
2. Enter their name, your email (for notification), and a custom message
3. Click "Create Proposal" → "Copy Link"
4. Send the link to that special someone
5. When they click "Yes!" → you get an email! 🎉

---

Built with 💖 using Node.js, Express, Nodemailer, and lots of Sanrio vibes 🎀🐱💀