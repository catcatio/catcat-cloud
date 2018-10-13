import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript'

import { File } from './File'
import { FileKey } from './FileKey'
import { FileKeyAccount } from './FileKeyAccount'

@Table({
  tableName: 'account',
  timestamps: true
})
export class Account extends Model<Account> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @Unique
  @Column(DataType.TEXT)
  public userKey: string

  @Column(DataType.TEXT)
  public publicKeyArmored: string

  @Column(DataType.TEXT)
  public privateKeyArmored: string

  @HasMany(() => File, 'ownerId')
  public files: File[]

  @BelongsToMany(() => FileKey, () => FileKeyAccount)
  public signedFileKey: FileKey[]

  @CreatedAt
  public creationDate: Date

  @UpdatedAt
  public updatedOn: Date

  @DeletedAt
  public deletionDate: Date

  constructor(values?: any, options?: any) {
    super(values, options)
  }
}
