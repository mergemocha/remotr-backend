import Daemon, { DaemonDocument } from '../../types/Daemon'
import DaemonModel from '../models/Daemon'
import DatabaseDriver from './DatabaseDriver'

export default class DaemonDriver implements DatabaseDriver<DaemonDocument> {
  getAll = async (): Promise<DaemonDocument[]> => await DaemonModel.find({})
  getByMac = async (mac: string): Promise<DaemonDocument | null> => await DaemonModel.findOne({ mac })
  getByToken = async (token: string): Promise<DaemonDocument | null> => await DaemonModel.findOne({ token })
  insert = async (daemon: Daemon): Promise<void> => void new DaemonModel(daemon).save()
  update = async (oldDaemon: DaemonDocument, newDaemon: DaemonDocument): Promise<void> => void oldDaemon.update(newDaemon)
}
