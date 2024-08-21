/*
    🌟 Base para desenvolvedores 🌟 

  Este script foi disponibilizado gratuitamente 
    e é proibido a venda deste código sem o 
      consentimento do criador MrRoots.

    *** Deixe os créditos do criador na base ***
*/

const fs = require('fs')
const chalk = require('chalk')

module.exports = mr = async (mr, store, info, prefixo, nomeBot, nomeDono, numeroDono, type, content, altpdf, from, body, budy, pushname, username, isGrupo, sender, groupMetadata, groupName, groupDesc, participants, groupMembers, groupAdmins, botNumber, args, quoted, mime, texto, isCmd, comando, isGrupoAdmins, isBotGrupoAdmins, isDono, isBot, hora, data, isImage, isVideo, isAudio, isSticker, isContact, isContactx, isLocation, isProduct, isDocumento, isQuotedMsg, isQuotedImage, isQuotedVideo, isQuotedDocument, isQuotedAudio, isQuotedSticker, isQuotedContact, isQuotedContactx, isQuotedLocation, isQuotedProduct, mentions, enviar) => {
  try {
    // inicio dos comandos com prefixo
    switch (comando) {
      case 'oi': {
        enviar('Olá, tudo bem?')
        break
      }

      case 'audio': {
        const audioPath = './src/midia/audio.mp3';
        mr.sendMessage(from, { audio: { url: audioPath }, mimetype: 'audio/mp4' }, { quoted: info })
        break
      }

      case 'foto': {
        const imagePath = './src/midia/foto.jpg';
        mr.sendMessage(from, { image: { url: imagePath }, caption: 'Aqui está sua foto!' }, { quoted: info })
        break
      }

      case 'video': {
        const videoPath = './src/midia/video.mp4';
        mr.sendMessage(from, { video: { url: videoPath }, mimetype: 'video/mp4', caption: 'Aqui está seu vídeo!' }, { quoted: info })
        break
      }

      case 'contato': {
        const vcard = 'BEGIN:VCARD\n' +
          'VERSION:3.0\n' +
          'FN:Nome do Contato\n' +
          'ORG:Nome Empresa;\n' +
          'TEL;type=CELL;type=VOICE;waid=5511999999999:+55 11 99999-9999\n' +
          'END:VCARD';
        await mr.sendMessage(from, { contacts: { displayName: 'Nome do Contato', contacts: [{ vcard: vcard }] } })
        break
      }

      case 'sticker': {
        const stickerPath = './src/midia/sticker.webp';
        mr.sendMessage(from, { sticker: { url: stickerPath } }, { quoted: info })
        break
      }

      case 'loc': {
        const loc = { degreesLatitude: -23.55052, degreesLongitude: -46.633308 };
        mr.sendMessage(from, { location: loc, caption: 'Aqui está a localização!' }, { quoted: info })
        break
      }

      case 'pdf': {
        const pdfPath = './src/midia/exemplo.pdf';
        mr.sendMessage(from, { document: { url: pdfPath }, mimetype: 'application/pdf', fileName: 'Dicas de exemplo.pdf' })
        break
      }

      case 'foto-unica': {
        mr.sendMessage(from, { image: { url: './src/midia/foto.jpg' }, caption: 'Esta imagem só pode ser visualizada uma vez!', voiceOnce: true })
        break
      }

      case 'reagir': {
        const reactionMessage = '❤️';
        mr.sendMessage(from, { react: { text: reactionMessage, key: info.key } });
        break
      }

      default:
        if (isCmd) {
          enviar('🚫 Comando não encontrado!')
        }
    }

  } catch (e) {
    console.log('Ocorreu um erro: ', e)
  }
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.greenBright(`Arquivo modificado: ${__filename}`))
  delete require.cache[file]
  require(file)
})
