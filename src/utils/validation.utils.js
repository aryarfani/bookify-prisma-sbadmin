exports.joiOptions = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true, // remove unknown props
	errors: { wrap: { label: '' } }, // remove "\" on key
}
