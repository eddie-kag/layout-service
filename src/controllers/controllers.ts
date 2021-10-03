import { createClient as createClientApi, getClient as getClientApi } from "@api/clients";
import Client from "@db/models/Client";
import logger from "@shared/logger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateClientRequest } from "./CreateClientRequest";

export const createClient = (req: Request, res: Response) => {
    const validation = CreateClientRequest.validate(req.body)
    if (validation.success) {
        createClientApi(<Client>validation.value).then((client: Client|'exists') => {
            if (client === 'exists') {
                res.status(StatusCodes.CONFLICT).json({error: 'Client already exists.'})
            } else {
                res.status(StatusCodes.CREATED).json(client)
            }
        }).catch((error: Error) => {
            logger.err(error, true)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
        })
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: validation.details || validation.message,
        })
    }
}

export const getClient = (req: Request, res: Response) => {
    const id = req.params.id

    getClientApi(id).then((client) => {
        if (client) {
            res.status(StatusCodes.OK).json(client)
        } else {
            res.status(StatusCodes.NOT_FOUND).end()   
        }
    }).catch((error) => {
        logger.err(error, true)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    })
}