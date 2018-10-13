import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'

import { Account } from './Account'
import { FileKeyAccount } from './FileKeyAccount'

@Table({
  tableName: 'filekey',
  timestamps: true
})
export class FileKey extends Model<FileKey> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @Column(DataType.TEXT)
  public encryptedValue: string

  @ForeignKey(() => Account)
  @Column
  public ownerId: number

  @BelongsTo(() => Account, 'ownerId')
  public owner: Account

  @BelongsToMany(() => Account, () => FileKeyAccount)
  public signedBy: Account[]

  @CreatedAt
  public creationDate: Date

  @UpdatedAt
  public updatedOn: Date

  @DeletedAt
  public deletionDate: Date
}
