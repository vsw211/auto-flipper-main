import { ScoreBoard } from 'mineflayer'
import { MyBot } from '../types/autobuy'
import { printMcChatToConsole, log } from './logger'
import { sleep } from './utils'

export function initAFKHandler(bot: MyBot) {
    let consecutiveTeleportAttempts = 0
    registerCheckInverval()

    function registerCheckInverval() {
        setTimeout(async () => {
            let teleportWasTried = await tryToTeleportToIsland(bot)
            if (teleportWasTried) {
                consecutiveTeleportAttempts++
                log(`ConsecutiveTeleportAttemps: ${consecutiveTeleportAttempts}`)
                registerCheckInverval()
            } else {
                consecutiveTeleportAttempts = 0
                registerCheckInverval()
            }
        }, 10000 * (consecutiveTeleportAttempts + 1))
    }
}

    export async function tryToTeleportToIsland(bot: MyBot, delayBeforeTeleport = 10*1000) {
    if (isLimbo(bot.scoreboard.sidebar)) {
        await sleep(delayBeforeTeleport)
        log('Bot seems to be in limbo. Sending "/lobby"')
        printMcChatToConsole('§f[§4BAF§f]: §fYou seem to be in limbo.')
        printMcChatToConsole('§f[§4BAF§f]: §fWarping back to lobby...')
        bot.customChat('/lobby')
        return true
    }

    if (bot.scoreboard['1'] && !bot.scoreboard['1'].name.includes('SBScoreboard')) {
        await sleep(delayBeforeTeleport)
        log(`Bot seems to be in lobby (Sidebar title = ${bot.scoreboard.sidebar.title}). Sending "/play sb"`)
        printMcChatToConsole('§f[§4BAF§f]: §fYou seem to be in the lobby.')
        printMcChatToConsole('§f[§4BAF§f]: §fWarping back into skyblock...')
        bot.customChat('/play sb')
        return true
    }

    let scoreboard = bot.scoreboard.sidebar.items.map(item => item.displayName.getText(null).replace(item.name, ''))
    if (!scoreboard.find(e => e.includes('Your Island'))) {
        await sleep(delayBeforeTeleport)
        log('Bot is not on island. Warping back')
        printMcChatToConsole('§f[§4BAF§f]: §fYou seem to not be on your island.')
        printMcChatToConsole('§f[§4BAF§f]: §fWarping back to island...')
        printMcChatToConsole('§f[§4BAF§f]: §fWarping back to island...')
        bot.customChat('/is')
        return true
    }

    return false
}

function isLimbo(sidebar: ScoreBoard) {
    let isLimbo = true
    sidebar.items.forEach(item => {
        if (item.displayName.getText(null).replace(item.name, '') !== '') {
            isLimbo = false
        }
    })
    return isLimbo
}
