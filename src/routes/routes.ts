import { createRoom, getRoom } from "@controllers/rooms/roomsController";
import { Router } from "express";

const router = Router()

router.post('/rooms', createRoom)
router.get('/rooms/:id', getRoom)

router.post('/objects', createRoom)
router.get('/objects/:id', getRoom)

export default router