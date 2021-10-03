import { createRoom as createRoomApi, getRoom as getRoomApi, Room } from "@api/rooms";
import logger from "@shared/logger";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateRoomRequest } from "./CreateRoomRequest";

export const createRoom = (req: Request, res: Response) => {
    const validation = CreateRoomRequest.validate(req.body)
    if (validation.success) {
        const {id, name, clientId, coordinates} = validation.value
        createRoomApi({id, name, clientId, coordinates}).then((room: Room|'exists') => {
            if (room === 'exists') {
                res.status(StatusCodes.CONFLICT).json({error: 'Room already exists.'})
            } else {
                res.status(StatusCodes.CREATED).json(room)
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

export const getRoom = (req: Request, res: Response) => {
    const id = req.params.id

    getRoomApi(id).then((room) => {
        if (room) {
            res.status(StatusCodes.OK).json(room)
        } else {
            res.status(StatusCodes.NOT_FOUND).end()   
        }
    }).catch((error) => {
        logger.err(error, true)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: error.message})
    })
}