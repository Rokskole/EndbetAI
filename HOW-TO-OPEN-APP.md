# How to Open the Mobile App

## The Mobile App is Starting! 📱

You now have **TWO servers running**:
1. ✅ **API Server** - `https://endbet-ai-api-749k.vercel.app` (for backend)
2. ✅ **Mobile App** - Expo development server (for the app)

## How to Open the App:

### Option 1: On Your Phone (Recommended)

1. **Install Expo Go app** on your phone:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Look at your terminal** - you should see a QR code

3. **Scan the QR code**:
   - iOS: Use Camera app
   - Android: Use Expo Go app's scanner

4. The app will open on your phone!

### Option 2: On Your Computer (Android Emulator)

1. Open Android Studio
2. Start an Android emulator
3. Press `a` in the terminal where Expo is running

### Option 3: On Your Computer (iOS Simulator - Mac only)

1. Press `i` in the terminal where Expo is running
2. iOS simulator will open

### Option 4: In Web Browser

1. Press `w` in the terminal where Expo is running
2. App will open in your browser at `http://localhost:8081`

## Current Status:

Check your PowerShell terminal - you should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

## Common Issues:

### Can't see QR code?
Run this command in a NEW terminal window:
```powershell
cd C:\Users\Rok\Downloads\EndbetAI
npm run dev:mobile
```

### App shows connection error?
- Make sure your phone is on the **same WiFi network** as your computer
- Check firewall isn't blocking port 8081

### Want to restart everything?
```powershell
# Stop all Node processes
Get-Process node | Stop-Process -Force

# Start API
npm run dev:api

# In another terminal, start mobile app
npm run dev:mobile
```

## Testing the Chat Feature:

Once the app opens:
1. You'll see a login screen
2. Enter your email
3. You'll get a magic link (check Supabase dashboard for dev)
4. Once logged in, go to the Chat tab
5. Start chatting!

## Both Servers Need to Run:

Keep **BOTH** terminal windows open:
- Terminal 1: API server (endbet-ai-api-749k.vercel.app)
- Terminal 2: Expo mobile app (localhost:8081)

## Your Original Question Fixed:

You asked about:
```powershell
curl -Uri "@https://vercel.com/rok3 /chat" ...
```

Now you know:
- That URL was for **Vercel's dashboard**, not your API
- Your **API** runs at `https://endbet-ai-api-749k.vercel.app/api/chat/messages`
- Your **mobile app** runs through Expo at `http://localhost:8081`
- They work together: App → API → Database

Enjoy your app! 🎉

