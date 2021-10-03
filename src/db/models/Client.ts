import { SCHEMA } from '@db/db'
import {
  Table,
  Model,
  Column,
  PrimaryKey,
} from 'sequelize-typescript'

@Table({ schema: SCHEMA, tableName: 'client' })
export default class Client extends Model {
  @PrimaryKey
  @Column
  id!: string

  @Column
  name!: string
}
