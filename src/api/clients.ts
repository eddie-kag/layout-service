import Client from "@db/models/Client";
import { UniqueConstraintError } from "sequelize";

export const createClient = async (client: {id: string, name: string}): Promise<Client | 'exists'> => {
    try {
        return await Client.create(client)
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return 'exists'
        } else {
            throw error
        }
    }
}

export const getClient = async (id: string): Promise<Client | null> => {
    return await Client.findByPk(id)
}