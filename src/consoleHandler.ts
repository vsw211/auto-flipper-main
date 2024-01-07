import readline from 'readline'
import { getConfigProperty } from './configHelper'

export function setupConsoleInterface(ws: WebSocket) {
    if (!getConfigProperty('ENABLE_CONSOLE_INPUT')) {
        return
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.on('line', input => {
        if ((input?.startsWith('/cofl') || input?.startsWith('/baf')) && input?.split(' ').length >= 2) {
            let splits = input.split(' ')
            splits.shift() // remove /cofl
            let command = splits.shift()

            ws.send(
                JSON.stringify({
                    type: command,
                    data: `"${splits.join(' ')}"`
                })
            )
        } else {
            ws.send(
                JSON.stringify({
                    type: 'chat',
                    data: `"${input}"`
                })
            )
        }
    })
}
