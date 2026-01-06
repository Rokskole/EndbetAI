# How to Update Privacy Policy Email

The privacy policy currently uses placeholder emails. Update them to your actual email address.

## Files to Update:

1. `apps/mobile/PRIVACY_POLICY.md` - Line 140, 194, 218, 225, 228
2. `apps/mobile/privacy-policy.html` - Line 194, 230, 232
3. `simple-server.js` - Line 726, 738 (in privacy policy route)

## Search and Replace:

Replace `privacy@quitbetai.com` with your actual email (e.g., `yourname@gmail.com`)
Replace `support@quitbetai.com` with your actual email (e.g., `yourname@gmail.com`)

## Quick Command (if using same email for both):

```powershell
# Replace in all files
Get-ChildItem -Recurse -Include *.md,*.html,*.js | ForEach-Object {
    (Get-Content $_.FullName) -replace 'privacy@quitbetai\.com', 'your-email@gmail.com' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace 'support@quitbetai\.com', 'your-email@gmail.com' | Set-Content $_.FullName
}
```

