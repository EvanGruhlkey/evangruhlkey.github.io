# Environment Variables Template

Copy these variables to your `backend/.env` file and fill in your actual values.

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Secret (for compatibility)
JWT_SECRET=your-secret-key-change-in-production

# Frontend URL (for CORS and password reset emails)
FRONTEND_URL=http://localhost:3000

# eBay API Configuration
# Get your keys from: https://developer.ebay.com
EBAY_APP_ID=your-ebay-app-id
EBAY_CERT_ID=your-ebay-cert-id
EBAY_DEV_ID=your-ebay-dev-id

# OpenAI API (for deal scoring - optional)
OPENAI_API_KEY=your-openai-key

# Email Service (optional - for notifications)
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=alerts@quoril.com
```

## How to Set Up

1. Create a file named `.env` in the `backend/` directory
2. Copy the template above into the file
3. Replace all `your-*` placeholders with your actual keys
4. See `EBAY_SETUP.md` for instructions on getting eBay API keys


