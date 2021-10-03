import RoomModel from "@db/models/Room";
import { UniqueConstraintError } from "sequelize";

export interface Room {
    id: string,
    name: string
}

export const createRoom = async (room: {id: string, name: string}): Promise<Room | 'exists'> => {
    try {
        return await RoomModel.create(room)
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return 'exists'
        } else {
            throw error
        }
    }
}

export const getRoom = async (id: string) => {
    return await RoomModel.findByPk(id)
}