import { default as RoomModel } from "@db/models/Room";
import { UniqueConstraintError } from "sequelize";

type Coordinates = number[][]

export interface Room {
    id: string,
    name: string, 
    clientId: string,
    coordinates: Coordinates
}

export const createRoom = async (room: {id: string, name: string, clientId: string, coordinates: Coordinates}): Promise<Room | 'exists'> => {
    const {id, name, clientId, coordinates} = room
    try {
        const wrappedCoordinates = []
        wrappedCoordinates.push(coordinates)
        const room = await RoomModel.create({
            id, name, clientId,
            coordinates: {type: 'Polygon', coordinates: wrappedCoordinates}
        })

        return modelToInterface(room)
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return 'exists'
        } else {
            throw error
        }
    }
}

export const getRoom = async (id: string) => {
    const room = await RoomModel.findByPk(id)
    return room ? modelToInterface(room) : undefined
}

function modelToInterface(room: RoomModel) {
    return {
        id: room.id,
        name: room.name,
        clientId: room.clientId,
        coordinates: room.coordinates.coordinates
    }
}