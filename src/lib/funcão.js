const axios = require('axios')
const Crypto = require('crypto')
const mimetype = require('mime-types')

const getExtension = async (type) => {
	return await mimetype.extension(type)
};

const getBuffer = async (url, opcoes) => {
	try {
		opcoes ? opcoes : {}
		const post = await axios({
			method: "get",
			url,
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...opcoes,
			responseType: 'arraybuffer'
		})
		return post.data
	} catch (erro) {
		console.log(`Erro identificado: ${erro}`)
	}
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		if (i.admin == 'admin') admins.push(i.id)
		if (i.admin == 'superadmin') admins.push(i.id)
	}
	return admins
}

const getMembros = (participants) => {
	admins = []
	for (let i of participants) {
		if (i.admin == null) admins.push(i.id)
	}
	return admins
}

const randomBytes = (length) => {
	return Crypto.randomBytes(length);
};

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`;
};

authorname = global.author
packname = global.packname

function addMetadata(packname, author) {
	if (!packname) packname = global.author; if (!author) author = global.packname;
	author = author.replace(/[^a-zA-Z0-9]/g, '');
	let name = `${author}_${packname}`
	if (fs.existsSync(`../tmp/${name}.exif`)) return `../tmp/${name}.exif`
	const json = {
		"sticker-pack-name": packname,
		"sticker-pack-publisher": author,
	}
	const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])
	const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]
	let len = JSON.stringify(json).length
	let last
	if (len > 256) {
		len = len - 256
		bytes.unshift(0x01)
	} else {
		bytes.unshift(0x00)
	}
	if (len < 16) {
		last = len.toString(16)
		last = "0" + len
	} else {
		last = len.toString(16)
	}
	const buf2 = Buffer.from(last, "hex")
	const buf3 = Buffer.from(bytes)
	const buf4 = Buffer.from(JSON.stringify(json))
	const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])
	fs.writeFile(`../tmp/${name}.exif`, buffer, (err) => {
		return `../tmp/${name}.exif`
	})
}

function kyun(seconds) {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}
	var horas = Math.floor(seconds / (60 * 60));
	var minutos = Math.floor(seconds % (60 * 60) / 60);
	var segundos = Math.floor(seconds % 60);
	return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`
}

module.exports = { getExtension, getBuffer, getGroupAdmins, getMembros, randomBytes, getRandom, addMetadata, kyun }