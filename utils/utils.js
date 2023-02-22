const utils = {}
utils.response = (data, error) => {
  return { data, error }
}

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.code = statusCode
  }
}
utils.error = HttpError

module.exports = utils
