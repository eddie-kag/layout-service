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
export default class RoomModel extends Model {
  @PrimaryKey
  @Column
  id!: string

  @Column
  name!: string

  @Column({type: DataType.GEOMETRY})
  coordinates!: Polygon
}
