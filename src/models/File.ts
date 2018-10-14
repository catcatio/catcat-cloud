import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt
} from 'sequelize-typescript'

import { Account } from './Account'
import { FileKey } from './FileKey'

@Scopes({
  full: {
    include: [
      () => FileKey,
      () => Account,
    ]
  },
  signing: {
    include: [
      {
        model: () => FileKey,
        include: [{
          model: () => Account,
          as: 'signedBy'
        }, {
          model: () => Account,
          as: 'owner'
        }],
      },
      {
        model: () => Account,
      },
    ]
  }
})
@Table({
  tableName: 'file',
  timestamps: true
})
export class File extends Model<File> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id: string

  @Column
  public ipfsHash: string

  @Column
  public ipfsPath: string

  @Column
  public size: number

  @Column
  public filename: string

  @Column
  public mimetype: string

  @ForeignKey(() => Account)
  @Column
  public ownerId: number

  @ForeignKey(() => FileKey)
  @AllowNull
  @Column
  public fileKeyId?: number

  @BelongsTo(() => Account, 'ownerId')
  public owner: Account

  @BelongsTo(() => FileKey, 'fileKeyId')
  public fileKey: FileKey

  @CreatedAt
  public creationDate: Date

  @UpdatedAt
  public updatedOn: Date

  @DeletedAt
  public deletionDate: Date
}
