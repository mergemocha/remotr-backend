import Daemon, { DaemonDocument } from '../types/Daemon'
import DaemonModel from './models/Daemon'

export async function getAll (lean?: boolean): Promise<DaemonDocument[]> {
  return lean
    ? await DaemonModel.find({}).lean()
    : await DaemonModel.find({})
}

export async function getByMac (mac: string, lean?: boolean): Promise<DaemonDocument | null> {
  return lean
    ? await DaemonModel.findOne({ mac }).lean()
    : await DaemonModel.findOne({ mac })
}

export async function getByToken (token?: string, lean?: boolean): Promise<DaemonDocument | null> {
  return lean
    ? await DaemonModel.findOne({ token }).lean()
    : await DaemonModel.findOne({ token })
}

export async function insert (daemon: Daemon): Promise<void> {
  await new DaemonModel(daemon).save()
}

export async function update (oldDaemon: DaemonDocument, newDaemon: DaemonDocument): Promise<void> {
  await oldDaemon.update(newDaemon)
}

export async function remove (oldDaemon: DaemonDocument): Promise<void> {
  await DaemonModel.findByIdAndDelete(oldDaemon._id)
}
