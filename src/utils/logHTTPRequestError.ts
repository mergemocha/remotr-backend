import { inspect } from 'util'

export default (err: any): void => {
  logger.error('An HTTP request failed. More information to follow.')

  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    const { data, status, headers } = err.response

    logger.error('Request succeeded, but response was in error range (4xx-5xx).')
    logger.error(`Status: ${inspect(status)}`)
    logger.error(`Headers: ${inspect(headers)}`)
    logger.error(`Data: ${inspect(data)}`)
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js

    logger.error('Request was made, but no response was received.')
    logger.error(`Request data: ${inspect(err.request)}`)
  } else {
    logger.error('A generic error occurred, request could not be constructed.')
    logger.error(`Error: ${inspect(err.message)}`)
  }

  logger.error(`Stack trace: ${err.stack}`)
  logger.error(`Request configuration: ${inspect(err.config)}`)
}
