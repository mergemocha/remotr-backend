import Daemon from '../types/Daemon'

interface StrippedDaemon {
  [key: string]: string | undefined
}

export default (daemon: Daemon): StrippedDaemon => {
  // Strip extraneous and sensitive data from the daemon before sending it downstream
  const fieldsToExclude = ['__v', '_id', 'token']

  const filteredDaemon: StrippedDaemon = {}

  for (const field in daemon) {
    if (!fieldsToExclude.includes(field)) {
      filteredDaemon[field] = daemon[field]
    }
  }

  return filteredDaemon
}
