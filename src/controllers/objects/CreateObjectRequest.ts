import { Record, Static, String } from 'runtypes'
import { Coordinates } from '@controllers/common/Coordinates'

export const CreateObjectRequest = Record({
    id: String,
    name: String,
    roomId: String,
    coordinates: Coordinates
})

export type CreateObjectRequest = Static<
  typeof CreateObjectRequest
>
