require('./set.js')

/**
* THANKS TO...
* Adiwajshing (Created Baileys)
* Danzz Coding (My Self)
*/

// Module
const {
	BufferJSON,
	WA_DEFAULT_EPHEMERAL,
	generateWAMessageFromContent,
	proto,
	generateWAMessageContent,
	generateWAMessage,
	prepareWAMessageMedia,
	areJidsSameUser,
	getContentType
} = require('@adiwajshing/baileys')

const fs = require('fs')
const axios = require('axios')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const timeZone = require('moment-timezone')
const ffmpeg = require('fluent-ffmpeg')
const { performance } = require('perf_hooks')
const { JSDOM } = require('jsdom')
const { spawn, exec, execSync } = require("child_process")

// lib
const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./lib/myfunc')

// Time
const hariini = timeZone.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')
const barat = timeZone.tz('Asia/Jakarta').format('HH:mm:ss')
const tengah = timeZone.tz('Asia/Makassar').format('HH:mm:ss')
const timur = timeZone.tz('Asia/Jayapura').format('HH:mm:ss')
const youtube = ('https://youtube.com/c/DanzzCoding')
const wa = `0@s.whatsapp.net`
const owner = global.owner + '@s.whatsapp.net'

var time = timeZone.tz('Asia/Jakarta')
.format('HH:mm:ss')

module.exports = danzz = async (danzz, m, store, chatUpdate) => {
	try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = prefa ? /^[Â°â€¢Ï€Ã·Ã—Â¶âˆ†Â£Â¢â‚¬Â¥Â®â„¢+âœ“_=|~!?@#$%^&.Â©^]/gi.test(body) ? body.match(/^[Â°â€¢Ï€Ã·Ã—Â¶âˆ†Â£Â¢â‚¬Â¥Â®â„¢+âœ“_=|~!?@#$%^&.Â©^]/gi)[0] : "" : prefa ?? global.prefix
        const isCmd = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const text = q = url = args.join(" ")
        const fatkuns = (m.quoted || m)
        const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const qmsg = (quoted.msg || quoted)
        const from = m.chat
        const isMedia = /image|video|sticker|audio/.test(m.quoted ? m.quoted.mtype : m.mtype)
        const isVideo = (m.quoted ? m.quoted.mtype : m.mtype) == 'videoMessage'
        const isImage = (m.quoted ? m.quoted.mtype : m.mtype) == 'imageMessage'
        const pushname = m.pushName || "No Name"
        const botNumber = await danzz.decodeJid(danzz.user.id)
        const isOwner = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const myNumber = m.sender == botNumber ? true : false
        
        // Group
        const groupMetadata = m.isGroup ? await danzz.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
    	const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    	const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    	const isPremium = isOwner || global.premium.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    	
    	// Limit
    	try {
            let isNumber = x => typeof x === 'number' && !isNaN(x)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            
            // Afk
            if (user) {
                if (!isNumber(user.afkTime)) user.afkTime = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!isNumber(user.limit)) user.limit = limitUser
            } else global.db.data.users[m.sender] = {
                afkTime: -1,
                afkReason: '',
                limit: limitUser,
            }
    
            let chats = global.db.data.chats[m.chat]
            if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}
            if (chats) {
                if (!('mute' in chats)) chats.mute = false
                if (!('antilink' in chats)) chats.antilink = true
            } else global.db.data.chats[m.chat] = {
                mute: false,
                antilink: true,
            }
            
            // Reset Limit
        	let cron = require('node-cron')
        	cron.schedule('00 12 * * *', () => {
            let user = Object.keys(global.db.data.users)
            let limitUser = isPremium ? global.limitawal.premium : global.limitawal.free
            for (let jid of user) global.db.data.users[jid].limit = limitUser
            console.log('Reseted Limit')
        	}, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        })
		
	    let setting = global.db.data.settings[botNumber]
        if (typeof setting !== 'object') global.db.data.settings[botNumber] = {}
	    if (setting) {
		if (!isNumber(setting.status)) setting.status = 0
		if (!('autobio' in setting)) setting.autobio = true
		if (!('templateImage' in setting)) setting.templateImage = true
		if (!('templateVideo' in setting)) setting.templateVideo = false
		if (!('templateGif' in setting)) setting.templateGif = false
		if (!('templateMsg' in setting)) setting.templateMsg = false
		if (!('templateLocation' in setting)) setting.templateLocation = false
	    } else global.db.data.settings[botNumber] = {
		status: 0,
		autobio: true,
		templateImage: true,
		templateVideo: false,
		templateGif: false,
		templateMsg: false,
		templateLocation: false,
	    }
	    
        } catch (err) {
            console.error(err)
        }
        
        // Anti Link
        if (db.data.chats[m.chat].antilink) {
        if (budy.match(`chat.whatsapp.com`)) {
        if (!isBotAdmins) return m.reply(`Ehh bot gak admin`)
        let gclink = (`https://chat.whatsapp.com/`+await danzz.groupInviteCode(m.chat))
        let isLinkThisGc = new RegExp(gclink, 'i')
        let isgclink = isLinkThisGc.test(m.text)
        if (isgclink) return m.reply(`Ngapain Lu Ngirim Link Group Ini?`)
        if (isAdmins) return m.reply(`Admin Mah Bebas Yakan?`)
        if (isOwner) return m.reply(`Owner Bot Mah Bebas Yakan?`)
        m.reply(`[ *ANTI LINK* ]\n\nKamu Terdeteksi Mengirim Link Grup, Kamu Akan Di Kick!!!`)
        danzz.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        }
        
        // Sayying time
        const hours = timeZone().tz('Asia/Jakarta').format('HH:mm:ss')
        if(hours < "23:59:00"){
        var sayyingTime = 'Selamat Malam 🌃'
}
        if(hours < "19:00:00"){
        var sayyingTime = 'Selamat Petang 🌆'
}
        if(hours < "18:00:00"){
        var sayyingTime = 'Selamat Sore 🌅'
}
        if(hours < "15:00:00"){
        var sayyingTime = 'Selamat Siang 🏙'
}
        if(hours < "10:00:00"){
        var sayyingTime = 'Selamat Pagi 🌄'
}
        if(hours < "05:00:00"){
        var sayyingTime = 'Selamat Subuh 🌉'
}
        if(hours < "03:00:00"){
        var sayyingTime = 'Selamat Tengah Malam 🌌'
}
	// auto set bio
	if (db.data.settings[botNumber].autobio) {
	    let setting = global.db.data.settings[botNumber]
	    if (new Date() * 1 - setting.status > 1000) {
		let uptime = await runtime(process.uptime())
		await danzz.setStatus(`${global.namabot} | Runtime : ${runtime(process.uptime())}`)
		setting.status = new Date() * 1
	    }
	}
	
	// Respon Cmd with media
        if (isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
        let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
        let { text, mentionedJid } = hash
        let messages = await generateWAMessage(m.chat, { text: text, mentions: mentionedJid }, {
            userJid: danzz.user.id,
            quoted: m.quoted && m.quoted.fakeObj
        })
        messages.key.fromMe = areJidsSameUser(m.sender, danzz.user.id)
        messages.key.id = m.key.id
        messages.pushName = m.pushName
        if (m.isGroup) messages.participant = m.sender
        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }
        danzz.ev.emit('messages.upsert', msg)
        }
        
        // Public & Self
        if (!danzz.public) {
            if (!m.key.fromMe) return
        }

        // Push Message To Console && Auto Read
        if (m.message) {
            danzz.readMessages([m.key])
            console.log(chalk.black(chalk.bgGreen('[ Chat ]')), chalk.black(chalk.blueBright(new Date)), chalk.black(chalk.greenBright(budy || m.mtype)) + '\n' + chalk.magentaBright('- from'), chalk.blueBright(pushname), chalk.greenBright(m.sender) + '\n' + chalk.blueBright('- in'), chalk.cyanBright(m.isGroup ? pushname : 'Private Chat', m.chat))
        }
        
        // Hit
        global.hit = {}
		if (isCmd) {
		data = await fetchJson('https://api.countapi.xyz/hit/danzz-api.herokuapp.com/visitor')
		totalcmd = `${data.value}`
		dataa = await fetchJson(`https://api.countapi.xyz/hit/danzz${timeZone.tz('Asia/Jakarta').format('DDMMYYYY')}/visits`)
		hittoday = `${dataa.value}`
	}
        
        // End
		switch(command) {
		
		// Start Cmd                        
            case 'menu': case 'help': case 'm': {
            let me = m.sender
            let menu = `*Hello ${pushname} 👋, ${sayyingTime}*

*INFO USER*
Name: ${pushname}
Number: @${me.split('@')[0]}
Premium: ${isPremium ? '✅' : `❌`}
Limit: ${isPremium ? 'Unlimited' : `${db.data.users[m.sender].limit}`}

*INFO BOT*
Nama Bot: ${global.namabot}
Owner: @${owner.split('@')[0]}
Mode: ${danzz.public ? 'Public' : `Self`}
Prefix:「 MULTI-PREFIX 」
Total Hit: ${totalcmd}
Hit Today: ${hittoday}

*TIME*
Tanggal: ${hariini}
Wib: ${barat} WIB
Wita: ${tengah} WITA
Wit: ${timur} WIT

*FEATURES*
*Downloader*
> ytplay [title]
> ytplaymp3 [title]
> ytplaymp4 [title]
> ytmp3 [url]
> ytmp4 [url]
> ttvideo [url]
> ttaudio [url]
> mediafire [url]

*Asupan*
> randomasupan
> santuy
> bocil
> hijaber
> ukhty

*Cecan*
> randomcecan
> hijaber
> china
> indonesia
> japan
> korea
> thailand
> vietnam

*Cogan*
> randomcogan

*Maker*
> ttp
> attp

*Others*
> tts (text to spech)

*Owner*
> self
> public
> delete (msg)`
      	  let buttons = [
                    {buttonId: `rules`, buttonText: {displayText: 'Rules'}, type: 1},
                    {buttonId: `donasi`, buttonText: {displayText: 'Donasi'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${menu}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
            
            // Owner
            case 'author': case 'owner': case 'creator': {
                danzz.sendContact(m.chat, global.owner, m)
            }
            break
            
            case 'tqto': case 'thanksto': case 'contributor': {
            let tqto = `
*THANKS TO*
@Adiwajshing (Baileys)
@Dika Ardnt (Base)
@Saipul Anuar (Partner)
@Yudha (Partner)
@Arull (Partner)
@Danzz Coding (Me)

*Penyedia Rest Api*
https://danzzapi.xyz (danzz)`
      	  let buttons = [
                    {buttonId: `rules`, buttonText: {displayText: 'Rules'}, type: 1},
                    {buttonId: `donasi`, buttonText: {displayText: 'Donasi'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${tqto}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
        
	    	case 'rules': {
            let rules = `
*RULES*
1. Jangan Pernah Spam Bot
2. Jangan Call Nomer Bot
3. Jangan Mengeksploitasi Bot

Sanksi : *Warn/Soft Block*

*About Questions*

You : Bot nya Slow Respon
Bot : Mohon Bersabar, Mungkin
Kendala Dari Jaringan, Signal,
Atau Bahkan Terbanned Dari
Pihak WhatsApp

You : Scriptnya Beli Dimana?
Bot: Wa.me/6289512545999

You : Boleh Masukin Ke Grup Saia
Tidak?
Bot : Untuk Masalah Memasukkan
Bot Ke Dalam Grup Bisa
Menghubungi Owner

You: Apakah Bot Ini Masih
Menyimpan File Yang Saya Kirim?
Bot : Data WhatsApp Anda Hanya
Tersimpan Saat Bot Aktif, Dan Bot
Tidak Pernah Menyimpan File-file
Yang Anda Kirim

You : Min, Ada Fitur Yang Error
Bot : Jika Menemukan Bug/Error
Silahkan Langsung Hubungi
Owner/Creator Agar Segera Di Fix

Tetap Patuhi Rules Agar Tetap
Bisa Menikmati Bot

*Note* : Segala Ketentuan Dan
Kebijakan Yang Berlaku Di Pegang
Oleh Owner Bot, Sewaktu-Waktu
Owner Berhak Memakai Ataupun
Mengubah Kebijakan Dan
Ketentuan Yang Berlaku

*Thanks* Buat Kalian
User-User Yang Sudah Memakai Bot,
Yang Sudah Mau Mematuhi
Rules, Serta Para Constributor
Yang Sudah Membantu Dalam
Pembuatan Bot Ini
Ini`
      	  let buttons = [
                    {buttonId: `menu`, buttonText: {displayText: 'Menu'}, type: 1},
                    {buttonId: `donasi`, buttonText: {displayText: 'Donasi'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${rules}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
           
       case 'donasi': case 'donate': {
let payment = `
*Hai Kak ${pushname}, ${sayyingTime}*

donate to me so that the bot can develop more.

*e-wallet*
Dana: 089512545999
Gopay: 089512545999`
let buttons = [
                    {buttonId: `rules`, buttonText: {displayText: 'Rules'}, type: 1},
                    {buttonId: `menu`, buttonText: {displayText: 'Menu'}, type: 1},
                    {buttonId: `owner`, buttonText: {displayText: 'Owner'}, type: 1}
                ]
                let buttonMessage = {
                    image: { url: 'https://telegra.ph/file/6d3a9d6f88c9d5bbb0330.jpg' },
                    caption: `${payment}`,
                    footer: `${global.wm}`,
                    buttons: buttons,
                    headerType: 4
                }
                danzz.sendMessage(m.chat, buttonMessage, { quoted: m })
        }
        break
        
        // Features
        // Downloader
        case 'ytplay': case 'ytplaymp3': {
         	if (!q) throw `Example : ${prefix + command} title`
         	m.reply(mess.wait)
             let ytplaymp3 = await fetchJson(`https://danzzapi.xyz/api/downloader/ytplaymp3?query=${q}&apikey=${global.apikeyprem}`)
             danzz.sendMessage(m.chat, { audio: { url: ytplaymp3.result.url }, mimetype: 'audio/mpeg', fileName: `${q}.mp3` }, { quoted: m })
         	}
         break
         
         case 'ytplaymp4': {
         	if (!q) throw `Example : ${prefix + command} title`
         	m.reply(mess.wait)
             let ytplaymp4 = await fetchJson(`https://danzzapi.xyz/api/downloader/ytplaymp4?query=${q}&apikey=${global.apikeyprem}`)
             danzz.sendMessage(m.chat, { video: { url: ytplaymp4.result.url }, mimetype: 'video/mp4', fileName: `${q}.mp4`, caption: `Done` }, { quoted: m })
         	}
         break
         
         case 'youtubemp3': case 'ytaudio': case 'ytmp3': {
         	if (!url) throw `Example : ${prefix + command} title`
         	m.reply(mess.wait)
             let ytmp3 = await fetchJson(`https://danzzapi.xyz/api/downloader/ytmp4?url=${url}&apikey=${global.apikey}`)
             danzz.sendMessage(m.chat, { audio: { url: ytmp3.result.url }, mimetype: 'audio/mpeg', caption: `Done` }, { quoted: m })
         	}
         break
         
         case 'youtubemp4': case 'ytvideo': case 'ytmp4': {
         	if (!url) throw `Example : ${prefix + command} title`
         	m.reply(mess.wait)
             let ytmp4 = await fetchJson(`https://danzzapi.xyz/api/downloader/ytmp4?url=${url}&apikey=${global.apikey}`)
             danzz.sendMessage(m.chat, { video: { url: ytmp4.result.url }, mimetype: 'video/mp4', caption: `Title: ${ytmp4.result.title}` }, { quoted: m })
         	}
         break
         
         case 'mediafire': {
         	if (!url) throw `Example : ${prefix + command} url`
         	m.reply(mess.wait)
             let mediafire = await fetchJson(`https://danzzapi.xyz/api/downloader/mediafire?url=${url}&apikey=${global.apikeyprem}`)
             danzz.sendMessage(m.chat, { document: { url: mediafire.result.url }, mimetype: 'document/zip', fileName: `${mediafire.result.title}` }, { quoted: m })
         	}
         break
         
         case 'tiktokaudio': case 'ttaudio': case 'ttmp3': {
         	if (!url) throw `Example : ${prefix + command} url`
         	m.reply(mess.wait)
             let ttmp3 = await fetchJson(`https://danzzapi.xyz/api/downloader/ttmp3?url=${url}&apikey=${global.apikey}`)
             danzz.sendMessage(m.chat, { audio: { url: ttmp3.result.audio }, mimetype: 'audio/mpeg', fileName: `${url}.mp3` }, { quoted: m })
         	}
         break
         
         case 'tiktok': case 'tiktoknowm': case 'tiktokvideo': case 'ttmp4': case 'ttaudio': case 'tt': {
         	if (!url) throw `Example : ${prefix + command} url`
         	m.reply(mess.wait)
             let ttmp4 = await fetchJson(`https://danzzapi.xyz/api/downloader/ttmp4?url=${url}&apikey=${global.apikey}`)
             danzz.sendMessage(m.chat, { video: { url: ttmp4.result.video }, mimetype: 'video/mp4', fileName: `${url}.mp4`, caption: `Done` }, { quoted: m })
         	}
         break
         
         // Asupan
        case 'randomasupan': case 'asupan': {
            m.reply(mess.wait)
			asupan = await getBuffer(`https://danzzapi.xyz/api/asupan/random?apikey=${global.apikeyprem}`)
			danzz.sendMessage(m.chat, {video: asupan, mimetype: 'video/mp4', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'randomasupan': case 'asupan': {
            m.reply(mess.wait)
			asupan = await getBuffer(`https://danzzapi.xyz/api/asupan/random?apikey=${global.apikeyprem}`)
			danzz.sendMessage(m.chat, {video: asupan, mimetype: 'video/mp4', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'santuy': {
            m.reply(mess.wait)
			asupan = await getBuffer(`https://danzzapi.xyz/api/asupan/santuy?apikey=${global.apikeyprem}`)
			danzz.sendMessage(m.chat, {video: asupan, mimetype: 'video/mp4', caption: `Done`}, {quoted:m})
			}
			break
		
		case 'bocil': {
            m.reply(mess.wait)
			asupan = await getBuffer(`https://danzzapi.xyz/api/asupan/bocil?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {video: asupan, mimetype: 'video/mp4', caption: `Done`}, {quoted:m})
			}
			break
		
		case 'hijaber': {
            m.reply(mess.wait)
			asupan = await getBuffer(`https://danzzapi.xyz/api/asupan/hijaber?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {video: asupan, mimetype: 'video/mp4', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'ukhty': {
            m.reply(mess.wait)
			asupan = await getBuffer(`https://danzzapi.xyz/api/asupan/ukhty?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {video: asupan, mimetype: 'video/mp4', caption: `Done`}, {quoted:m})
			}
			break
		
		// Cecan
		case 'randomcecan': case 'cecan': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/random?apikey=${global.apikeyprem}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'china': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/china?apikey=${global.apikeyprem}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'indonesia': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/indonesia?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'japan': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/japan?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
			
		case 'korea': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/korea?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
		
		case 'thailand': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/thailand?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
		
		case 'vietnam': {
            m.reply(mess.wait)
			cecan = await getBuffer(`https://danzzapi.xyz/api/cecan/vietnam?apikey=${global.apikeyprem}`)
			danzz.sendMessage(m.chat, {image: cecan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
			
		// Cogan
		case 'cogan': {
            m.reply(mess.wait)
			cogan = await getBuffer(`https://danzzapi.xyz/api/cogan/random?apikey=${global.apikey}`)
			danzz.sendMessage(m.chat, {image: cogan, mimetype: 'image/png', caption: `Done`}, {quoted:m})
			}
			break
			
		// Maker
		case 'ttp': {
           if (!text) throw `Example : ${prefix + command} text`
           await danzz.sendMedia(m.chat, `https://danzzapi.xyz/api/maker/ttp?text=${text}&apikey=${global.apikey}`, 'danzz', 'coding', m, {asSticker: true})
         }
         break
         
         case 'attp': {
           if (!text) throw `Example : ${prefix + command} text`
           await danzz.sendMedia(m.chat, `https://danzzapi.xyz/api/maker/attp?text=${text}&apikey=${global.apikey}`, 'danzz', 'coding', m, {asSticker: true})
         }
         break
			
		// Others
         case 'texttospech': case 'tts': {
         	if (!text) throw `Example : ${prefix + command} text`
         	m.reply(mess.wait)
             let tts = await fetchJson(`https://danzzapi.xyz/api/tools/tts?text=${text}&lang=id-ID&apikey=${global.apikey}`)
             danzz.sendMessage(m.chat, { audio: { url: tts.result }, mimetype: 'audio/mpeg', fileName: `${text}.mp3` }, { quoted: m })
         	}
         break
         
         // Owner Menu
         case 'self': {
                if (!isOwner) throw mess.owner
                danzz.public = false
                m.reply('Self Mode Activate')
            }
            break
            
            case 'public': {
                if (!isOwner) throw mess.owner
                danzz.public = true
                m.reply('Public Mode Activate')
            }
            break
            
            case 'delete': case 'del': {
                if (!m.quoted) throw false
                let { chat, fromMe, id, isBaileys } = m.quoted
                if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot!'
                danzz.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender } })
            }
            break
         
		// End Cmd
		default:
                if (budy.startsWith('=>')) {
                    if (!isOwner) return m.reply(mess.owner)
                    function Return(sul) {
                        sat = JSON.stringify(sul, null, 2)
                        bang = util.format(sat)
                            if (sat == undefined) {
                                bang = util.format(sul)
                            }
                            return m.reply(bang)
                    }
                    try {
                        m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                    } catch (e) {
                        m.reply(String(e))
                    }
                }

                if (budy.startsWith('>')) {
                    if (!isOwner) return m.reply(mess.owner)
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await m.reply(evaled)
                    } catch (err) {
                        await m.reply(String(err))
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isOwner) return m.reply(mess.owner)
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return m.reply(`${err}`)
                        if (stdout) return m.reply(stdout)
                    })
                }
			
		if (isCmd && budy.toLowerCase() != undefined) {
		    if (m.chat.endsWith('broadcast')) return
		    if (m.isBaileys) return
		    let msgs = global.db.data.database
		    if (!(budy.toLowerCase() in msgs)) return
		    danzz.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
		}
        }
        

    } catch (err) {
        m.reply(util.format(err))
    }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
