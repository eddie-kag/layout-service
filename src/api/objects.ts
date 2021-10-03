import db from "@db/db";
import ObjectModel from "@db/models/Object";
import { UniqueConstraintError } from "sequelize";
import Coordinates from "./Coordinates";
import DEFAULT_SRID from "./DefaultSrid";

export interface Object {
    id: string,
    name: string, 
    roomId: string,
    coordinates: Coordinates
}

export const createObject = async (object: {id: string, name: string, roomId: string, coordinates: Coordinates}): Promise<Object | Object[] | 'exists'> => {
    const {id, name, roomId, coordinates} = object

    const intersections = await intersects(roomId, coordinates)
    if (intersections.length > 0) {
        return intersections.map(intersection => modelToObject(intersection))
    }

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

        return modelToObject(room)
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
    return object ? modelToObject(object) : undefined
}

export const intersects = async (roomId: string, coordinates: Coordinates) => {
    let coordinatesString = ''
    for (const coordinate of coordinates) {
        coordinatesString = `${coordinatesString} ${coordinate[0]} ${coordinate[1]},`
    }
    coordinatesString = coordinatesString.slice(1, coordinatesString.length - 1)
    const geometryText = `POLYGON((${coordinatesString}))`

    const query = `select * from layout_service.object where 
        room_id = :room_id 
        and 
        ST_WITHIN(ST_GeomFromText(:geometry_text)::geometry, object.coordinates)`
    return await db.query(query, {
        replacements: { room_id: roomId, geometry_text: geometryText},
        model: ObjectModel,
        mapToModel: true,
    })
}

function modelToObject(object: ObjectModel):Object {
    return {
        id: object.id,
        name: object.name,
        roomId: object.roomId,
        coordinates: object.coordinates.coordinates
    }
}