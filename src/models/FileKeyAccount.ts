import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'

import { Account } from './Account'
import { FileKey } from './FileKey'

@Table({
  tableName: 'filekey-account',
})
export class FileKeyAccount extends Model<FileKeyAccount> {
  @ForeignKey(() => FileKey)
  @Column
  public fileKeyId: number

  @ForeignKey(() => Account)
  @Column
  public accountId: number
}
