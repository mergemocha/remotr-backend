import { Document } from 'mongoose'

export default interface DatabaseDriver<T extends Document> {
  getAll: () => Promise<T[]>
  insert: (newT: T) => Promise<void>
  update: (oldT: T, newT: T) => Promise<void>
}
