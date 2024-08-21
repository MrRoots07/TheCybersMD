/*
    🌟 Base para desenvolvedores 🌟 

  Este script foi disponibilizado gratuitamente 
    e é proibido a venda deste código sem o 
      consentimento do criador MrRoots.

    *** Deixe os créditos do criador na base ***
*/

const fs = require('fs')
const P = require('pino')
const chalk = require('chalk')
const { Boom } = require('@hapi/boom')
const NodeCache = require('node-cache')
const readline = require('readline')
const moment = require('moment-timezone')

const {
  default:
  makeWASocket,
  WAConnection,
  downloadContentFromMessage,
  useMultiFileAuthState,
  makeInMemoryStore,
  DisconnectReason,
  WAGroupMetadata,
  relayWAMessage,
  MessageOptions,
  MediaPathMap,
  mentionedJid,
  MediaType,
  Browser,
  proto,
  MessageType,
  Presence,
  Mimetype,
  Browsers,
  delay,
  fetchLatestBaileysVersion,
  MessageRetryMap,
  extractGroupMetadata,
  AnyMessageContent,
  BinaryInfo,
  encodeWAM,
  BufferJSON,
  WAMessageKey,
  PHONENUMBER_MCC,
  WAMessageContent,
  WA_DEFAULT_EPHEMERAL,
  buttonsMessage,
  getAggregateVotesInPollMessage,
  makeCacheableSignalKeyStore,
  generateWAMessageFromContent,
  jidNormalizedUser,
  getBinaryNodeChildren,
  generateWAMessageContent,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  extractMessageContent,
  generateMessageID,
  jidDecode,
  generateWAMessage,
  toBuffer,
  getContentType,
  getDevice
} = require('@whiskeysockets/baileys');

const { color, bgcolor } = require('./src/lib/color')
const { getExtension, getBuffer, getGroupAdmins, getMembros, randomBytes, getRandom, addMetadata, kyun } = require('./src/lib/funcão')
const { banner, banner2, start, infopd, success, close } = require('./src/lib/banners')
const infoBot = JSON.parse(fs.readFileSync('./dono/config.json'));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const useMobile = process.argv.includes('--mobile')
const usePairingCode = process.argv.includes('--use-pairing-code')
const msgRetryCounterCache = new NodeCache()
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })
store.readFromFile('./src/conexao/session/conexao.json');
setInterval(() => {
  store.writeToFile('./src/conexao/session/conexao.json');
}, 10000);
const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./src/conexao/logs/logs.txt'))
logger.level = 'trace'

const prefixo = infoBot.prefixo
const nomeBot = infoBot.nomeBot
const nomeDono = infoBot.nomeDono
const numeroDono = infoBot.numeroDono

const startBot = async () => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./src/conexao/session')
    const { version } = await fetchLatestBaileysVersion()
    const mr = makeWASocket({
      version,
      logger,
      printQRInTerminal: usePairingCode,
      mobile: useMobile,
      browser: Browsers.ubuntu('Safari'),
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
          message?.interactiveMessage
        );
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          };
        }
        return message;
      },
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      transactionOpts: {
        maxCommitRetries: 10,
        delayBetweenTriesMs: 10,
      },
      getMessage,
      syncFullHistory: true,
      maxMsgRetryCount: 15,
      msgRetryCounterCache,
      retryRequestDelayMs: 10,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 10000,
      defaultQueryTimeoutMs: undefined,
      generateHighQualityLinkPreview: true
    });

    if (!mr.authState.creds.registered) {
      console.clear()
      console.log(banner.string)
      console.log(banner2.string)
      success('1', 'Script carregado, seja bem vindo(a)!')
      const numeroWhats = await question(color(`• Digite seu número de WhatsApp:\nEx: ${color('554892050170', 'white')} ou ${color('+55 48 9205-0170', 'white')} \n➜  `, 'green'))
      const nmr = numeroWhats.replace(/[^0-9]/g, '')
      setTimeout(async () => {
        rl.close()
        console.clear()
        const code = await mr.requestPairingCode(nmr)
        console.log(`• Número: ${nmr}\n\n• Código de Emparelhamento: ${color(`${code}`, 'blue')}`)
        start('1', `Aguardando a verificação...`)
      }, 2000)
    }

    store.bind(mr.ev)

    mr.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'open') {
        console.clear();
        console.log(banner.string)
        console.log(banner2.string)
        success('1', 'Bot conectado com sucesso!')
      }
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.badSession) {
          close('1', `${color('Faça login novamente!', 'red')}`)
          mr.logout()
        }
        else if (reason === DisconnectReason.connectionClosed) {
          start('1', `${color('Conexão fechada, reiniciando...', 'gray')}`)
          startBot()
        }
        else if (reason === DisconnectReason.connectionLost) {
          start('1', `${color('Conexão perdida, reconectando...', 'gray')}`)
          startBot()
        }
        else if (reason === DisconnectReason.connectionReplaced) {
          console.log(`${color('Conexão substituida, faça login novamente!', 'red')}`)
          mr.logout()
        }
        else if (reason === DisconnectReason.loggedOut) {
          close('1', `${color('Bot desconectado!', 'red')}`)
          mr.logout()
        }
        else if (reason === DisconnectReason.restartRequired) {
          start('1', `${color('Reiniciando o Bot..', 'gray')}`)
          await startBot()
        }
        else if (reason === DisconnectReason.timedOut) {
          start('1', `${color('Tempo esgotado, reiniciando...', 'gray')}`)
          startBot()
        }
        else mr.end(`[❗] Erro Desconhecido: ${reason}|${connection}`)
      }
    })

    mr.ev.on('messages.upsert', async connection => {
      const info = connection.messages[0];
      if (connection.type != 'notify') return;
      if (info.key.remoteJid === 'status@broadcast') return;
      const type = Object.keys(info.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(info.message)[2] : (Object.keys(info.message)[0] == 'messageContextInfo') ? Object.keys(info.message)[1] : Object.keys(info.message)[0]
      const content = JSON.stringify(info.message);
      const altpdf = Object.keys(info.message)
      const from = info.key.remoteJid
      const body = type === "conversation" ? info.message.conversation : type === "viewOnceMessageV2" ? info.message.viewOnceMessageV2.message.imageMessage ? info.message.viewOnceMessageV2.message.imageMessage.caption : info.message.viewOnceMessageV2.message.videoMessage.caption : type === "imageMessage" ? info.message.imageMessage.caption : type === "videoMessage" ? info.message.videoMessage.caption : type === "extendedTextMessage" ? info.message.extendedTextMessage.text : type === "viewOnceMessage" ? info.message.viewOnceMessage.message.videoMessage ? info.message.viewOnceMessage.message.videoMessage.caption : info.message.viewOnceMessage.message.imageMessage.caption : type === "documentWithCaptionMessage" ? info.message.documentWithCaptionMessage.message.documentMessage.caption : type === "buttonsMessage" ? info.message.buttonsMessage.imageMessage.caption : type === "buttonsResponseMessage" ? info.message.buttonsResponseMessage.selectedButtonId : type === "listResponseMessage" ? info.message.listResponseMessage.singleSelectReply.selectedRowId : type === "templateButtonReplyMessage" ? info.message.templateButtonReplyMessage.selectedId : type === "groupInviteMessage" ? info.message.groupInviteMessage.caption : type === "pollCreationMessageV3" ? info.message.pollCreationMessageV3 : type === "interactiveResponseMessage" ? JSON.parse(info.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : type === "text" ? info.text : ""
      const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

      const pushname = info.pushName ? info.pushName : ''
      const username = info.username ? info.username : ''
      const isGrupo = info.key.remoteJid.endsWith('@g.us')
      const sender = isGrupo ? info.key.participant : info.key.remoteJid
      const groupMetadata = isGrupo ? await mr.groupMetadata(from) : ''
      const groupName = isGrupo ? groupMetadata.subject : ''
      const groupDesc = isGrupo ? groupMetadata.desc : ''
      const participants = isGrupo ? await groupMetadata.participants : ''
      const groupMembers = isGrupo ? groupMetadata.participants : ''
      const groupAdmins = isGrupo ? getGroupAdmins(groupMembers) : ''
      const botNumber = mr.user.id.split(':')[0] + '@s.whatsapp.net'
      const args = body.trim().split(/ +/).slice(1);
      const quoted = info.quoted ? info.quoted : info
      const mime = (quoted.msg || quoted).mimetype || ''
      const texto = q = args.join(" ")
      const isCmd = body.startsWith(prefixo);
      const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
      const isGrupoAdmins = groupAdmins.includes(sender) || false
      const isBotGrupoAdmins = groupAdmins.includes(botNumber) || false
      const isDono = sender.includes(numeroDono)
      const isBot = info.key.fromMe ? true : false

      const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
      const data = moment.tz('America/Sao_Paulo').format('DD/MM/YY');

      const isImage = type == 'imageMessage'
      const isVideo = type == 'videoMessage'
      const isAudio = type == 'audioMessage'
      const isSticker = type == 'stickerMessage'
      const isContact = type == 'contactMessage'
      const isContactx = type == 'contactsArrayMessage'
      const isLocation = type == 'locationMessage'
      const isProduct = type == 'productMessage'
      const isDocumento = type == 'documentMessage'
      if (isImage) typeMessage = 'Image'
      else if (isVideo) typeMessage = 'Video'
      else if (isAudio) typeMessage = 'Audio'
      else if (isSticker) typeMessage = 'Sticker'
      else if (isContact) typeMessage = 'Contact'
      else if (isContactx) typeMessage = 'Contact'
      else if (isLocation) typeMessage = 'Location'
      else if (isProduct) typeMessage = 'Product'
      else if (isDocumento) typeMessage = 'Document'
      const isQuotedMsg = type === 'extendedTextMessage' && content.includes('textMessage')
      const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
      const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
      const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
      const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
      const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
      const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
      const isQuotedContactx = type === 'extendedTextMessage' && content.includes('contactsArrayMessage')
      const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
      const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')

      const mentions = (teks, memberr, id) => {
        (id == null || id == undefined || id == false) ? mr.sendMessage(from, { text: teks.trim(), mentions: memberr }) : mr.sendMessage(from, { text: teks.trim(), mentions: memberr })
      }

      const enviar = (texto) => {
        mr.sendMessage(from, { text: texto }, { quoted: info })
      }

      require('./comandos')(mr, store, info, prefixo, nomeBot, nomeDono, numeroDono, type, content, altpdf, from, body, budy, pushname, username, isGrupo, sender, groupMetadata, groupName, groupDesc, participants, groupMembers, groupAdmins, botNumber, args, quoted, mime, texto, isCmd, comando, isGrupoAdmins, isBotGrupoAdmins, isDono, isBot, hora, data, isImage, isVideo, isAudio, isSticker, isContact, isContactx, isLocation, isProduct, isDocumento, isQuotedMsg, isQuotedImage, isQuotedVideo, isQuotedDocument, isQuotedAudio, isQuotedSticker, isQuotedContact, isQuotedContactx, isQuotedLocation, isQuotedProduct, mentions, enviar)

      if (!isGrupo && isCmd) {
        console.log(`${color('╭━━━━━━━━━━━━━━━━━━━━━━━╮', 'magenta')}`)
        console.log(`${color('┃', 'magenta')} ${color('Usúario:', 'yellow')} ${color(pushname, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Número:', 'yellow')} ${color(sender.split('@')[0], 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Data:', 'yellow')} ${color(data, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Hora:', 'yellow')} ${color(hora, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Comando:', 'yellow')} ${color(comando, 'green')}`)
        console.log(`${color('╰━━━━━━━━━━━━━━━━━━━━━━━╯', 'magenta')}`)
      }

      if (!isGrupo && !isCmd) {
        console.log(`${color('╭━━━━━━━━━━━━━━━━━━━━━━━╮', 'magenta')}`)
        console.log(`${color('┃', 'magenta')} ${color('Usúario:', 'yellow')} ${color(pushname, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Número:', 'yellow')} ${color(sender.split('@')[0], 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Data:', 'yellow')} ${color(data, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Hora:', 'yellow')} ${color(hora, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Mensagem:', 'yellow')} ${color(`${budy}`, 'white')}`)
        console.log(`${color('╰━━━━━━━━━━━━━━━━━━━━━━━╯', 'magenta')}`)
      }

      if (isGrupo && isCmd) {
        console.log(`${color('╭━━━━━━━━━━━━━━━━━━━━━━━╮', 'magenta')}`)
        console.log(`${color('┃', 'magenta')} ${color('Grupo:', 'yellow')} ${color(groupName, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Usúario:', 'yellow')} ${color(pushname, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Número:', 'yellow')} ${color(sender.split('@')[0], 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Data:', 'yellow')} ${color(data, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Hora:', 'yellow')} ${color(hora, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Comando:', 'yellow')} ${color(comando, 'green')}`)
        console.log(`${color('╰━━━━━━━━━━━━━━━━━━━━━━━╯', 'magenta')}`)
      }

      if (isGrupo && !isCmd) {
        console.log(`${color('╭━━━━━━━━━━━━━━━━━━━━━━━╮', 'magenta')}`)
        console.log(`${color('┃', 'magenta')} ${color('Grupo:', 'yellow')} ${color(groupName, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Usúario:', 'yellow')} ${color(pushname, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Número:', 'yellow')} ${color(sender.split('@')[0], 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Data:', 'yellow')} ${color(data, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Hora:', 'yellow')} ${color(hora, 'white')}`)
        console.log(`${color('┃', 'magenta')} ${color('Mensagem:', 'yellow')} ${color(`${budy}`, 'white')}`)
        console.log(`${color('╰━━━━━━━━━━━━━━━━━━━━━━━╯', 'magenta')}`)
      }
    });

    mr.ev.on('messages.update', async chatUpdate => {
      const info = chatUpdate[0];
      const isGrupo = info.key.remoteJid.endsWith('@g.us');
      const sender = isGrupo ? info.key.participant : info.key.remoteJid;
      const pushname = info.pushName ? info.pushName : '';
      const from = info.key.remoteJid;

      for (const { key, update } of chatUpdate) {
        if (update && update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            const pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation,
              pollUpdates: update.pollUpdates,
            });
            var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name;
            console.log(toCmd);
            if (toCmd === undefined) return;
            var prefCmd = prefixo + toCmd;
            const enviar = (texto) => {
              return mr.sendMessage(from, { text: texto });
            };
            const reply = enviar;
            reply(`A opção mais votada é: ${toCmd}`);
          }
        }
      }
    });

    mr.ev.on('creds.update', saveCreds)

    return mr

    async function getMessage(key) {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
      }
      return proto.Message.fromObject({})
    }
  } catch (e) {
    console.log('Erro ao iniciar o bot: ', e)
  }
}  

async function IniciarScript() {
  start('1', 'Iniciando, aguarde...')
  setTimeout(async () => {
    await startBot()
  }, 2000)
}

IniciarScript()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.greenBright(`Arquivo modificado: ${__filename}`))
  delete require.cache[file]
  require(file)
})
