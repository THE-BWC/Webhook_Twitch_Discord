# Twitch Discord Webhook
A simple node.js application that monitors BWC Members' Twitch channels for new streams and posts them to a Discord channel using a webhook.

## Requirements
- Twitch API (https://dev.twitch.tv/console/apps)
- Node.js (https://nodejs.org/en/download/) (v16.9.0 or higher)
- NPM (https://www.npmjs.com/get-npm) (should be installed with Node.js)
- PM2 (https://pm2.keymetrics.io/docs/usage/quick-start/) (Optional) - Used to run the application as a service.
- A Discord channel with a webhook.
- A list of BWC Members' Twitch usernames.

## Installation
### Run in terminal
1. Download the latest release from the releases page.
2. Extract the zip file to a directory of your choice.
3. Open a terminal window and navigate to the directory where you extracted the zip file.
4. Run `npm install` to install the required dependencies.
5. Run `npm run start` to start the application.
6. The application will now be running in the terminal window. You can close the terminal window if you wish.
7. To stop the application, press `CTRL + C` in the terminal window.

### Run as a service
1. Download the latest release from the releases page.
2. Extract the zip file to a directory of your choice.
3. Open a terminal window and navigate to the directory where you extracted the zip file.
4. Run `npm install` to install the required dependencies.
5. Run `pm2 start ecosystem.config.json` to start the application as a service. You can then use `pm2 stop <name>/<id>` to stop the application, and `pm2 restart name>/<id>` to restart the application.
6. If you wish to run the application as a service on startup, you can use PM2 to do so. Run `pm2 startup` to generate the startup command for your system. Then run the command that was generated to enable PM2 to run on startup. Then run `pm2 save` to save the current PM2 configuration. You can then use `pm2 stop name>/<id>` to stop the application, and `pm2 restart name>/<id>` to restart the application.

## Configuration
### config.json
1. Open the `config.json` file in a text editor.
2. Replace the `message` value with the message you want to be sent to the Discord channel.
3. Add the members channel id to the `Streamers` array.
4. Save the `config.json` file.

### ecosystem.config.json
1. Open the ecosystem.config.json file in a text editor.
2. Replace the `CLIENT_ID` value with your Twitch API Client ID.
3. Replace the `CLIENT_SECRET` value with your Twitch API Client Secret.
4. Replace the `WEBHOOK_URL` value with the webhook url for your Discord channel.
5. Save the `ecosystem.config.json` file.

### Notes
- The `message` value supports Discord markdown.
- You can find the members' usernames by going to their Twitch channel and copying the last part of the URL. For example, the username for https://www.twitch.tv/bradleyw is `bradleyw`.

## Logging
The application uses the `winston` logger to log messages to the console and to a log file. The log file is named `Youtube-API-Discord.log`.

## Contributing
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes.
4. Create a pull request.
5. Enjoy!

## License
All rights reserved to Black Widow Company. This repository is for internal use only. No redistribution is allowed.  
If you would like to use the application in this repository, please contact Black Widow Company. Thank you.  
[<img alt="Black Widow Company" height="50" src="https://the-bwc.com/PAO/BannerStandard.png"/>](https://www.the-bwc.com)

## Disclaimer
This repository is for internal use only. If you are not a member of Black Widow Company, you are not allowed to use any of the addons in this repository.  
If you are a member of Black Widow Company, you are not allowed to use, modify or distribute any of the addons in this repository without the express permission of the S-1 Technical Officer or the S-1 Officer in Charge.

## Contact
If you have any questions, feel free to contact me on Discord: `[BWC] Patrick#4943`, or on the [BWC Discord server](https://discord.com/invite/the-bwc) or the [BWC forums](https://the-bwc.com/forum/index.php).

## Credits
- [Twitch API](https://dev.twitch.tv/docs/api/)
- [Node.js](https://nodejs.org/en/) - Application Development
- [NPM](https://www.npmjs.com/) - Package Management
- [PM2](https://pm2.keymetrics.io/) - Process Management
- [Winston](https://github.com/winstonjs/winston) - Logging Library
- [Discord.js](https://discord.js.org/) - Discord API Library