import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'

import { Account } from './Account'
import { FileKey } from './FileKey'

@Table({
  tableName: 'file',
  timestamps: true
})
export class File extends Model<File> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @Column
  public hash: string

  @Column
  public path: string

  @Column
  public size: number

  @Column
  public filename: string

  @ForeignKey(() => Account)
  @Column
  public ownerId: number

  @ForeignKey(() => FileKey)
  @AllowNull
  @Column
  public fileKeyId: number

  @BelongsTo(() => Account, 'ownerId')
  public owner: Account

  @HasOne(() => FileKey, 'fileKeyId')
  public fileKey: FileKey

  @CreatedAt
  public creationDate: Date

  @UpdatedAt
  public updatedOn: Date

  @DeletedAt
  public deletionDate: Date
}
