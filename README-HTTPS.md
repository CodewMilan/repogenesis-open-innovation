# HTTPS Setup for Mobile Camera Access

## Quick Start

1. **Start the HTTPS dev server:**
   ```bash
   npm run dev:https
   ```

2. **Find your computer's IP address:**
   - Windows: Run `ipconfig` and look for IPv4 Address
   - Your IP will be something like `10.80.71.200`

3. **Access from your iPhone:**
   - Make sure your iPhone is on the same Wi-Fi network
   - Open Safari and go to: `https://10.80.71.200:3000`
   - Replace `10.80.71.200` with your actual IP address

## Trusting the Certificate on iPhone

Since this uses a self-signed certificate, you'll need to trust it on your iPhone:

1. **First time access:**
   - When you visit the HTTPS URL, Safari will show a warning
   - Tap "Advanced" → "Proceed to 10.80.71.200 (unsafe)"
   - This allows you to access the site, but camera may still not work

2. **To fully trust the certificate (for camera access):**
   - The certificate will be generated in the `certificates/` folder
   - Transfer `certificates/localhost.pem` to your iPhone (via email, AirDrop, etc.)
   - On iPhone: Settings → General → About → Certificate Trust Settings
   - Enable full trust for the certificate

## Alternative: Use ngrok (Easier for Testing)

If you want to avoid certificate issues, you can use ngrok:

1. Install ngrok: https://ngrok.com/
2. Start your regular dev server: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Use the HTTPS URL provided by ngrok on your iPhone

## Notes

- The HTTPS server will generate certificates automatically on first run
- Certificates are stored in `certificates/` folder (gitignored)
- Both devices must be on the same Wi-Fi network
- Your computer's firewall may need to allow connections on port 3000

