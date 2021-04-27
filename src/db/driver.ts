import Daemon, { DaemonDocument } from '../types/Daemon'
import DaemonModel from './models/Daemon'

/**
 * Returns all daemons in the database.
 *
 * @param lean - Whether to return dehydrated Mongoose documents (faster). (See: {@link https://mongoosejs.com/docs/tutorials/lean.html})
 * @returns Array of Daemon objects.
 */
export async function getAll (lean?: boolean): Promise<DaemonDocument[]> {
  return lean
    ? await DaemonModel.find({}).lean()
    : await DaemonModel.find({})
}

/**
 * Returns a daemon by searching for its MAC address, and returns null if not found.
 *
 * @param token - Daemon MAC address to search by.
 * @param lean - Whether to return dehydrated Mongoose documents (faster). (See: {@link https://mongoosejs.com/docs/tutorials/lean.html})
 * @returns Daemon object.
 */
export async function getByMac (mac: string, lean?: boolean): Promise<DaemonDocument | null> {
  return lean
    ? await DaemonModel.findOne({ mac }).lean()
    : await DaemonModel.findOne({ mac })
}

/**
 * Returns a daemon by searching for its token, and returns null if not found.
 *
 * @param token - Daemon token to search by.
 * @param lean - Whether to return dehydrated Mongoose documents (faster). (See: {@link https://mongoosejs.com/docs/tutorials/lean.html})
 * @returns Daemon object.
 */
export async function getByToken (token?: string, lean?: boolean): Promise<DaemonDocument | null> {
  return lean
    ? await DaemonModel.findOne({ token }).lean()
    : await DaemonModel.findOne({ token })
}

/**
 * Inserts a new Daemon into the database.
 *
 * @param daemon - {@link Daemon} to insert
 */
export async function insert (daemon: Daemon): Promise<void> {
  await new DaemonModel(daemon).save()
}

/**
 * Updates a Daemon.
 *
 * @param oldDaemon - {@link Daemon} to update
 * @param newDaemon - {@link Daemon} with new, updated data
 */
export async function update (oldDaemon: DaemonDocument, newDaemon: DaemonDocument): Promise<void> {
  await oldDaemon.update(newDaemon)
}

/**
 * Removes a Daemon.
 *
 * @param oldDaemon - {@link Daemon} to remove
 */
export async function remove (oldDaemon: DaemonDocument): Promise<void> {
  await DaemonModel.findByIdAndDelete(oldDaemon._id)
}
