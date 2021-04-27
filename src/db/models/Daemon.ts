import { model, Schema } from 'mongoose'
import { DaemonDocument } from '../../types/Daemon'

export default model<DaemonDocument>('Daemon', new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  mac: {
    type: String,
    unique: true
  },
  ip: {
    type: String,
    unique: true
  },
  user: {
    type: String
  },
  hostname: {
    type: String
  }
}))
