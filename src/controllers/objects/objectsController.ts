import { createObject as createObjectApi, getObject as getObjectApi, Object } from "@api/objects";
import logger from "@shared/logger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateObjectRequest } from "./CreateObjectRequest";

export const createObject = (req: Request, res: Response) => {
    const validation = CreateObjectRequest.validate(req.body)
    if (validation.success) {
        const createObjectRequest = validation.value
        console.log(validation)
        createObjectApi(createObjectRequest).then((object: Object|'exists') => {
            if (object === 'exists') {
                res.status(StatusCodes.CONFLICT).json({error: 'Object already exists.'})
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