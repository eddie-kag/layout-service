import { SCHEMA } from '@db/db'
import {
  Table,
  Model,
  Column,
  PrimaryKey,
} from 'sequelize-typescript'

@Table({ schema: SCHEMA, tableName: 'room' })
export default class RoomModel extends Model {
  @PrimaryKey
  @Column
  id!: string

  @Column
  name!: string
}
