const TwitchApi = require('node-twitch').default;
const Winston = require('winston');
const { WebhookClient, MessageEmbed } = require('discord.js');
const { setIntervalAsync } = require('set-interval-async/dynamic')
const config = require('./config.json')


/**
 * Logger
 */
let logger = Winston.createLogger({
    transports: [
        new Winston.transports.File({ filename: 'Twitch-API-Discord.log' })
    ],
    format: Winston.format.printf((log) => `[${new Date().toLocaleString()}] - [${log.level.toUpperCase()}] - ${log.message}`)
})

/**
 * Outputs to console during Development
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    logger.add(new Winston.transports.Console({
        format: Winston.format.simple()
    }))
}

let initialized = 0
let streamerStatusCache = {}
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL })

const twitch = new TwitchApi({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
})

/**
 * Get array of users
 * @param arrayOfStreamerNames
 * @return {Promise<*[]>}
 */
async function getUserIds(arrayOfStreamerNames) {
    logger.info(`Getting UserIDs...`);
    const userIds = await twitch.getUsers(arrayOfStreamerNames)

    let arrayOfUserIds = []
    for (const userId of userIds.data) {
        arrayOfUserIds.push(userId.id)
    }
    return arrayOfUserIds
}

/**
 * Get array of active streamers from array of user ids
 * @param arrayOfUserIds
 * @return arrayOfActiveStreams
 */
async function getStreams(arrayOfUserIds) {
    logger.info(`Getting Streams...`);
    return await twitch.getStreams({ channels: arrayOfUserIds });
}

async function sendWebhookMessage(stream, thumbnail, avatarURL) {
    const userName = stream.user_name
    const twitchURL = `https://twitch.tv/${userName}`
    let embed = new MessageEmbed()
        .setTitle(`${stream.title}`)
        .setURL(twitchURL)
        .setColor([153, 26, 26])
        .setFooter({ text: 'BWC Twitch Notifications' })
        .setAuthor({ name: `${userName} is now live on Twitch!`, url: `${twitchURL}`, iconURL: avatarURL })
        .setDescription(`[Watch Here](${twitchURL})`)
        .addField('Game', `${stream.game_name}`)
        .setImage(thumbnail)

    await webhookClient.send({
        content: config.message
                .replace('{streamer}', userName)
                .replace('{url}', userName),
        embeds: [embed]
    })
}

async function check(arrayOfStreamerNames) {
    logger.info(`Start checking...`);
    logger.info(`Streamer Cache: ${JSON.stringify(streamerStatusCache)}`)
    const arrayOfUserIds = await getUserIds(arrayOfStreamerNames)

    if (initialized === 0) {
        if (Object.keys(streamerStatusCache).length === 0) {
            for (const userId of arrayOfUserIds) {
                streamerStatusCache[userId] = { online: 0, user_name: "" }
            }
            initialized = 1
        }
    }

    const streams = await getStreams(arrayOfUserIds)

    for (const streamer of Object.entries(streamerStatusCache)) {
        if (Object.values(streams.data).find(stream => stream.user_id === streamer[0])) {
            const stream = Object.values(streams.data).find(stream => stream.user_id === streamer[0])
            if (streamer[1].user_name === "") streamer[1].user_name = stream.user_name
            if (streamer[1].online === 0) {
                logger.info(`[${stream.user_name}] | Streamer set to Online`);
                streamer[1].online = 1

                const thumbnail = stream.getThumbnailUrl()
                const user = await twitch.getUsers([stream.user_id])
                const avatarURL = user.data[0].profile_image_url
                await sendWebhookMessage(stream, thumbnail, avatarURL)
                logger.info(`[${stream.user_name}] | Posted notification`);
            }
        } else {
            if (streamer[1].online === 1) {
                logger.info(`[${streamer[1].user_name}] | Streamer set to Offline`);
                streamer[1].online = 0
            }
        }
    }
}

check(config.streamers)
    .catch(err => logger.error(err.stack))
setIntervalAsync(() => check(config.streamers).catch(err => logger.error(err.stack)), 15 * 1000)
