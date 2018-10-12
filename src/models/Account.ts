import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
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

  @Column
  public userKey: string

  @Column
  public publicKey: string

  @Column
  public privateKey: string

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
