import Client from "@db/models/Client";
import { UniqueConstraintError } from "sequelize";

export const createClient = async (client: Client): Promise<Client | 'exists'> => {
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

export const getClient = async (id: string) => {
    return await Client.findByPk(id)
}