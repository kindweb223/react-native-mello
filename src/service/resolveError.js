import * as keys from './ErrorJson/errors.json'

const resolveError = (code, defaultMessage) => (
  keys[code] ? keys[code] : defaultMessage
)

export default resolveError
