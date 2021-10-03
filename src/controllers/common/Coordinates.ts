import { Array, Static } from 'runtypes'
import { Coordinate } from './Coordinate'

export const Coordinates = Array(Coordinate)
    .withConstraint((arr) => {
      if (arr.length < 4) return 'Must be at least 4 coordinates.'
      else {
        const first = arr[0]
        const last = arr[arr.length - 1]

        if (first[0] !== last[0] || first[1] !== last[1]) {
          return `First and last coordinates must match.`
        }
      }

      return true
    })

export type Coordinates = Static<
  typeof Coordinates
>
