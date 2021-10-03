import { Record, Static, String } from 'runtypes'

export const CreateClientRequest = Record({
    id: String,
    name: String
})

export type CreateClientRequest = Static<
  typeof CreateClientRequest
>
