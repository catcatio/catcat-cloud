import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'version',
})
export class Version extends Model<Version> {
  @PrimaryKey
  @Column
  public name: string

  @Column
  public value: string
}
