import Daemon, { DaemonDocument } from '../../types/Daemon'
import DaemonModel from '../models/Daemon'
import DatabaseDriver from './DatabaseDriver'

export default class DaemonDriver implements DatabaseDriver<DaemonDocument> {
  async getAll (lean?: boolean): Promise<DaemonDocument[]> {
    return lean
      ? await DaemonModel.find({}).lean()
      : await DaemonModel.find({})
  }

  async getByMac (mac: string, lean?: boolean): Promise<DaemonDocument | null> {
    return lean
      ? await DaemonModel.findOne({ mac }).lean()
      : await DaemonModel.findOne({ mac })
  }

  async getByToken (token?: string, lean?: boolean): Promise<DaemonDocument | null> {
    return lean
      ? await DaemonModel.findOne({ token }).lean()
      : await DaemonModel.findOne({ token })
  }

  insert = async (daemon: Daemon): Promise<void> => void new DaemonModel(daemon).save()
  update = async (oldDaemon: DaemonDocument, newDaemon: DaemonDocument): Promise<void> => void oldDaemon.update(newDaemon)
  delete = async (oldDaemon: DaemonDocument): Promise<void> => {
    // This needs to be awaited or otherwise the operation never executes for no reason
    await DaemonModel.findByIdAndDelete(oldDaemon._id)
  }
}
