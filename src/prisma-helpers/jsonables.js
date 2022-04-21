function asset(el) {
	return process.env.APP_URL + 'files/' + el.image
}

// Function that will ddd prefix url to file in object
exports.parseAssets = (data, field = 'image') => {
	data.forEach((el) => {
		// current layer
		if (el[field] !== undefined && el[field] != null) {
			el[field] = asset(el)
		}

		// if element is an object
		Object.entries(el).forEach(([key, val]) => {
			if (val?.[field] !== undefined) {
				val[field] = asset(val)
			}

			// recursively check on nested child
			if (Array.isArray(val)) {
				this.parseAssets(val)
			}
		})
	})
}
