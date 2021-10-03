import { createObject, getObject } from "@controllers/objects/objectsController";
import { createRoom, getRoom } from "@controllers/rooms/roomsController";
import { Router } from "express";

const router = Router()

router.post('/rooms', createRoom)
router.get('/rooms/:id', getRoom)

router.post('/objects', createObject)
router.get('/objects/:id', getObject)

export default router