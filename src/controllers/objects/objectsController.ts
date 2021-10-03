import { createObject as createObjectApi, getObject as getObjectApi, getObjects as getObjectsApi, Object } from "@api/objects";
import logger from "@shared/logger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateObjectRequest } from "./CreateObjectRequest";

export const createObject = (req: Request, res: Response) => {
    const validation = CreateObjectRequest.validate(req.body)
    if (validation.success) {
        const createObjectRequest = validation.value
        createObjectApi(createObjectRequest).then((object: Object|Object[]|'exists') => {
            if (object === 'exists') {
                res.status(StatusCodes.CONFLICT).json({error: 'Object already exists.'})
            } else if (Array.isArray(object)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Object intersects with other objects in room.',
                    objects: object
                })
            } else {
                res.status(StatusCodes.CREATED).json(object)
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

export const getObject = (req: Request, res: Response) => {
    const id = req.params.id

    getObjectApi(id).then((object) => {
        if (object) {
            res.status(StatusCodes.OK).json(object)
        } else {
            res.status(StatusCodes.NOT_FOUND).end()   
        }
    }).catch((error) => {
        logger.err(error, true)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    })
}


export const getObjects = (req: Request, res: Response) => {
    const roomId = <string>req.query.roomId
    if (!roomId) {
        res.status(StatusCodes.BAD_REQUEST).json({error: 'Query parameter "roomId" is required.'})
        return
    }

    getObjectsApi(roomId).then((objects) => {
        res.status(StatusCodes.OK).json(objects)
    }).catch((error) => {
        logger.err(error, true)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    })
}