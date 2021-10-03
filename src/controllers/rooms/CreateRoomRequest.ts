import { Record, Static, String } from 'runtypes'
import { Coordinates } from '@controllers/common/Coordinates'

export const CreateRoomRequest = Record({
    id: String,
    name: String
})

export type CreateRoomRequest = Static<
  typeof CreateRoomRequest
>
