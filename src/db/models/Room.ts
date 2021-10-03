import { SCHEMA } from '@db/db'
import Polygon from '@db/types/Polygon'
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript'

@Table({ schema: SCHEMA, tableName: 'room' })
export default class Room extends Model {
  @PrimaryKey
  @Column
  id!: string

  @Column
  clientId!: string

  @Column
  name!: string

  @Column({type: DataType.GEOMETRY})
  coordinates!: Polygon
}
