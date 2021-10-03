import { createObject, getObject, getObjects } from "@controllers/objects/objectsController";
import { createRoom, getRoom } from "@controllers/rooms/roomsController";
import { Router } from "express";

const router = Router()

router.post('/rooms', createRoom)
router.get('/rooms/:id', getRoom)

router.post('/objects', createObject)
router.get('/objects/:id', getObject)
router.get('/objects', getObjects)

export default router