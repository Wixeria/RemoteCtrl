# RemoteCtrl
A web-based + Discord command bot for remote PC access.

# Features
- Remote system control via Discord     messages or web UI
 
-	Run terminal commands
 
-	Restart, shutdown, get system info, and more
 
-	Simple and fast Node.js backend

# Setup
1. Install dependencies with `npm install`
2. Create a .env file in the root with the following:
   ```env
   TOKEN = your_bot_token
   OWNER_ID = your_discord_id
   WEB_SECRET = your_web_secret
   ```
4. Fill in .env file.
5. Start the bot with `node .`
6. (Optional) You can start the bot whenever your machine turn on by just following these steps:
   - Create shortcut of start.bat
   - Copy shortcut.
   - Press Win + R
   - Type: `shell:startup`
   - Paste it into Startup folder."


# Last thing
Yes, you can reverse engineer it if you want.
But whatever you do with it,
I won’t take responsibility for the outcome.
