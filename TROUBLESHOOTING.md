# 🔧 Troubleshooting Guide

## **Common Issues & Solutions**

---

## ❌ **Issue: ERR_NAME_NOT_RESOLVED / Failed to fetch Supabase**

### **Error Message:**
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
TypeError: Failed to fetch
at SupabaseAuthClient.signInWithPassword
```

### **Cause:**
Environment variables not loaded or dev server needs restart

### **Solution:**

#### **Step 1: Verify Environment Variables**
```bash
cat .env.local | grep SUPABASE
```

Should show:
```
NEXT_PUBLIC_SUPABASE_URL=https://esbzzprfghkcigvyuiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

#### **Step 2: Restart Dev Server**
```bash
# Kill all Node processes
pkill -f "next dev"

# Clear cache
rm -rf .next

# Restart
npm run dev
```

#### **Step 3: Hard Refresh Browser**
```
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

#### **Step 4: Check Browser Console**
```javascript
// In browser console, type:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// Should show: https://esbzzprfghkcigvyuiw.supabase.co
```

---

## ❌ **Issue: White Screen / Blank Page**

### **Cause:**
CSS conflicts or component errors

### **Solution:**

#### **Check Browser Console**
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Share the error message
```

#### **Clear Everything**
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

---

## ❌ **Issue: Form Text Not Visible**

### **Cause:**
White text on white background

### **Solution:**
Already fixed in `app/globals.css`! Just refresh:
```bash
# Hard refresh browser
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

---

## ❌ **Issue: Login Redirects to Wrong Page**

### **Cause:**
Role not set in user profile

### **Solution:**

#### **Check User Role in Supabase:**
```sql
SELECT email, role, preferences 
FROM user_profiles 
WHERE email = 'your@email.com';
```

#### **Set Role Manually:**
```sql
UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'travunited3@gmail.com';
```

---

## ❌ **Issue: Tables Don't Exist**

### **Error:**
```
relation "user_profiles" does not exist
```

### **Solution:**

#### **Run Database Schemas in Order:**
```
1. Go to: https://supabase.com/dashboard/project/esbzzprfghkcigvyuiw/sql
2. Run these files in order:
   - database/schema.sql
   - database/auth-schema.sql
   - database/visa-applications-schema.sql
   - database/visa-pages-schema.sql
   - database/payments-schema.sql
   - database/rbac-schema.sql
   - database/tours-complete-schema.sql
   - database/tours-enhanced-schema.sql
   - database/social-sharing-schema.sql
```

---

## ❌ **Issue: Payment Failed**

### **Cause:**
Razorpay keys not configured

### **Solution:**

#### **Add Razorpay Keys to `.env.local`:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_secret_key
```

#### **Get Test Keys:**
```
1. Go to: https://dashboard.razorpay.com
2. Settings → API Keys
3. Generate Test Keys
4. Add to .env.local
5. Restart server
```

---

## ❌ **Issue: Email Not Sending**

### **Cause:**
Resend API key not configured

### **Solution:**

#### **Add Resend Key:**
```bash
# In .env.local
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=Travunited <noreply@travunited.com>
```

#### **Get API Key:**
```
1. Go to: https://resend.com
2. Sign up / Login
3. API Keys → Create API Key
4. Add to .env.local
5. Restart server
```

---

## ❌ **Issue: Build Errors**

### **Error:**
```
Type error: Cannot find name 'X'
```

### **Solution:**

#### **Missing Icon Import:**
```tsx
// Add missing icon to imports
import { Gift } from 'lucide-react';
```

#### **Clear and Rebuild:**
```bash
rm -rf .next
npm run build
```

---

## ❌ **Issue: Port 3000 Already in Use**

### **Error:**
```
Port 3000 is already in use
```

### **Solution:**

#### **Option 1: Kill Process on Port 3000**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

#### **Option 2: Use Different Port**
```bash
PORT=3001 npm run dev
```

---

## ❌ **Issue: Module Not Found**

### **Error:**
```
Module not found: Can't resolve '@/components/...'
```

### **Solution:**

#### **Reinstall Dependencies:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## ❌ **Issue: Supabase Connection Timeout**

### **Error:**
```
Error: Connection timeout
```

### **Solution:**

#### **Check Supabase Status:**
```
1. Go to: https://status.supabase.com
2. Check if there are any issues
```

#### **Verify Project URL:**
```
In .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://esbzzprfghkcigvyuiw.supabase.co
                                        ^
                             Check this matches your project
```

#### **Test Connection:**
```javascript
// In browser console:
fetch('https://esbzzprfghkcigvyuiw.supabase.co')
  .then(res => console.log('Connected!'))
  .catch(err => console.error('Connection failed:', err));
```

---

## 🔍 **Debug Checklist**

### **When Something Doesn't Work:**

```
□ Check browser console for errors
□ Check terminal for server errors
□ Verify .env.local exists and has correct values
□ Restart dev server (pkill, rm -rf .next, npm run dev)
□ Hard refresh browser (Cmd+Shift+R)
□ Check Supabase dashboard (tables exist?)
□ Check network tab (API calls failing?)
□ Check if logged in (session active?)
```

---

## 🛠️ **Quick Fixes**

### **Fix 1: Restart Everything**
```bash
# Kill server
pkill -f "next dev"

# Clear everything
rm -rf .next
rm -rf node_modules/.cache

# Restart
npm run dev
```

### **Fix 2: Check Environment**
```bash
# Verify env file exists
ls -la .env.local

# Verify content
cat .env.local
```

### **Fix 3: Test Supabase Connection**
```bash
# Try to fetch from Supabase
curl https://esbzzprfghkcigvyuiw.supabase.co
```

---

## 📞 **Still Having Issues?**

### **Collect This Information:**

1. **Error Message** (exact text from console)
2. **Browser** (Chrome, Firefox, Safari?)
3. **Page** (which page has the issue?)
4. **Action** (what were you trying to do?)
5. **Environment Variables** (do they exist?)
6. **Database Tables** (have they been created?)

---

## ✅ **Current Issue: Supabase Connection**

### **Your Error:**
```
ERR_NAME_NOT_RESOLVED
Failed to fetch at SupabaseAuthClient.signInWithPassword
```

### **Solution Applied:**
```
1. ✅ Verified environment variables exist
2. ✅ Killed all Node processes
3. ✅ Cleared .next cache
4. ✅ Restarted dev server
5. ⏳ Waiting for server to start...
```

### **Next Steps:**
```
1. Wait 30 seconds for server to fully start
2. Hard refresh browser (Cmd+Shift+R)
3. Try logging in again
4. Check browser console for any new errors
```

---

## 🎯 **Prevention Tips**

### **Always Do This After Changes:**
```
1. Restart dev server if:
   - Changed .env.local
   - Added new dependencies
   - Modified database schemas
   
2. Clear cache if:
   - Strange errors appear
   - Components don't update
   - Styles not applying
   
3. Hard refresh browser if:
   - Changes not visible
   - Old content showing
   - JavaScript errors
```

---

**Status:** Issue identified, fix applied  
**Action:** Wait for server restart, then hard refresh browser  
**ETA:** Server ready in 20-30 seconds


