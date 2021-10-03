import RoomModel from "@db/models/Room";
import { UniqueConstraintError } from "sequelize";
import Coordinates from "./Coordinates";
import DEFAULT_SRID from "./DefaultSrid";

export interface Room {
    id: string,
    name: string, 
    coordinates: Coordinates
}

export const createRoom = async (room: {id: string, name: string, coordinates: Coordinates}): Promise<Room | 'exists'> => {
    const {id, name, coordinates} = room
    try {
        const wrappedCoordinates = []
        wrappedCoordinates.push(coordinates)

        const coordinatesColumn = {
            type: 'Polygon', 
            coordinates: wrappedCoordinates, 
            crs: {
                type: 'Polygon', 
                coordinates: wrappedCoordinates, 
                crs: DEFAULT_SRID
            }
        }

        const room = await RoomModel.create({
            id, name, 
            coordinates: coordinatesColumn
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
        coordinates: room.coordinates.coordinates
    }
}