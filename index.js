const jimaku = (() => {
	/** @type {number} 連番の桁数 */
	const serialWidth = 6

	const delay = 100

	const container = document.querySelector('.watch-video')

	let prefix = 'jimaku-'
	let serial = 0

	/**
	 * ダウンロードファイル名の先頭につける名前を設定する
	 * @param {string} aPrefix
	 */
	const setPrefix = (aPrefix) => {
		prefix = aPrefix
	}

	/**
	 * 連番の開始番号を設定する
	 * @param {number} num
	 */
	const setStartNumber = (num) => {
		serial = Math.floor(num) - 1
	}

	/** @type {?string} 字幕画像の前のURL */
	let prevURL = null

	/**
	 * SVG image 要素から画像の data URI を生成する
	 *
	 * @param {SVGImageElement} image
	 * @return {string} 画像の data URI
	 */
	const createImageURI = (image) => {
		const canvas = document.createElement('canvas')
		canvas.width = image.width.baseVal.value
		canvas.height = image.height.baseVal.value
		const ctx = canvas.getContext('2d')
		ctx.drawImage(image, 0, 0)
		return canvas.toDataURL()
	}

	/**
	 * @param {string} uri
	 * @param {string} fileName
	 */
	const download = (uri, fileName) => {
		const link = document.createElement('a')
		link.href = uri
		link.download = fileName
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	/**
	 *
	 * @param {MutationRecord[]} mutationsList
	 */
	const onDOMChange = (mutationsList) => {
		const childListChanged = mutationsList.some((m) => m.type === 'childList')
		if (!childListChanged) return

		const image = container.querySelector('image')
		if (!image || image.href.baseVal === prevURL) return
		prevURL = image.href.baseVal

		setTimeout(() => {
			++serial
			download(createImageURI(image), prefix + String(serial).padStart(serialWidth, '0'))
		}, delay)
	}
	const observer = new MutationObserver(onDOMChange)

	/**
	 * 字幕の保存を開始する
	 */
	const observe = () => {
		observer.observe(container, {
			childList: true,
			subtree: true
		})
	}

	/**
	 * 字幕の保存を停止する
	 */
	const disconnect = () => {
		observer.disconnect()
	}

	return {
		observe,
		disconnect,
		setPrefix,
		setStartNumber,
	}
})()
