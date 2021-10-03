import { Array, Number, Record, Static, String } from 'runtypes'

export const Coordinate = Array(Number).withConstraint(arr => arr.length == 2 || `Coordinate must have exactly two values.`)

export type Coordinate = Static<
  typeof Coordinate
>
