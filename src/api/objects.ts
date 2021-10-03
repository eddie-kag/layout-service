import ObjectModel from "@db/models/Object";
import Polygon from "@db/types/Polygon";
import { UniqueConstraintError } from "sequelize";
import Coordinates from "./Coordinates";
import DEFAULT_SRID from "./DefaultSrid";

export interface Object {
    id: string,
    name: string, 
    roomId: string,
    coordinates: Coordinates
}

export const createObject = async (object: {id: string, name: string, roomId: string, coordinates: Coordinates}): Promise<Object | 'exists'> => {
    const {id, name, roomId, coordinates} = object
    try {
        const wrappedCoordinates = []
        wrappedCoordinates.push(coordinates)

        const room = await ObjectModel.create({
            id, name, roomId,
            coordinates: {
                type: 'Polygon', 
                coordinates: wrappedCoordinates, 
                crs: DEFAULT_SRID
            }
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

export const getObject = async (id: string) => {
    const object = await ObjectModel.findByPk(id)
    return object ? modelToInterface(object) : undefined
}

function modelToInterface(object: ObjectModel):Object {
    return {
        id: object.id,
        name: object.name,
        roomId: object.roomId,
        coordinates: object.coordinates.coordinates
    }
}