# Contact Form Setup Guide

## What's Been Built

✅ Contact form with name, email, and message fields  
✅ Frontend validation and submission handler  
✅ Vercel serverless function at `/api/contact`  
✅ Honeypot spam protection  
✅ Success/error status messages  
✅ Added "Contact" link to navigation  

## Setup Steps (5 minutes)

### 1. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free)
2. Verify your email
3. Go to **API Keys** in the dashboard
4. Click **Create API Key**
5. Copy the key (starts with `re_`)

### 2. Add to Vercel Environment Variables

**Option A: Via Vercel Dashboard**
1. Go to your project on [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Add new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_your_key_here`
   - **Environments:** Production, Preview, Development (select all)
4. Click **Save**

**Option B: Via Vercel CLI**
```bash
vercel env add RESEND_API_KEY
# Paste your key when prompted
# Select all environments
```

### 3. Deploy

Push to your repo — Vercel will auto-deploy with the new function:

```bash
git add .
git commit -m "Add contact form with Resend integration"
git push
```

### 4. Test It

Once deployed:
1. Go to your live site
2. Scroll to Contact section
3. Fill out the form
4. Submit
5. Check **info@josephgmedia.com** for the email

## Local Development Testing

To test locally:

```bash
npm install -D vercel
vercel dev
```

Then visit `http://localhost:3000` and test the form. Make sure you've added the `RESEND_API_KEY` to your local environment:

```bash
vercel env pull
```

This downloads your Vercel env vars to `.env.local`.

## Email Sending Limits (Free Tier)

- **Resend:** 100 emails/day, 3,000/month
- **From address:** Currently using `onboarding@resend.dev` (Resend's testing domain)

### To Use Your Own Domain

1. In Resend dashboard, go to **Domains**
2. Add `josephgmedia.com`
3. Add the DNS records Resend provides
4. Once verified, update line 45 in `/api/contact.js`:
   ```js
   from: 'Contact Form <contact@josephgmedia.com>',
   ```

## Files Created/Modified

**Created:**
- `/api/contact.js` — Serverless function
- `/src/js/contact-form.js` — Frontend handler
- `/CONTACT_FORM_SETUP.md` — This file

**Modified:**
- `/index.html` — Added form HTML and Contact nav link
- `/src/css/contact.css` — Added form styles
- `/src/js/main.js` — Import and initialize contact form

## Security Features

✅ Server-side validation  
✅ Email format validation  
✅ Honeypot field (catches bots)  
✅ CORS headers configured  
✅ API key secured in environment variables  

## Troubleshooting

**Form submits but no email received:**
- Check Vercel function logs: Dashboard → Functions → `/api/contact`
- Verify `RESEND_API_KEY` is set in Vercel env vars
- Check spam folder

**"Server configuration error":**
- API key not set or incorrect
- Redeploy after adding the env var

**"Failed to send email":**
- Check Resend dashboard logs
- You might have hit the daily limit (100 emails)
- Verify the API key has send permissions

## Next Steps (Optional)

- [ ] Add reCAPTCHA for extra spam protection
- [ ] Customize email template in `/api/contact.js`
- [ ] Add auto-reply to sender
- [ ] Set up email notifications (Slack, Discord, etc.)
