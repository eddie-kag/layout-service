import { createClient, getClient } from "@controllers/clients/clientsController";
import { createRoom, getRoom } from "@controllers/rooms/roomsController";
import { Router } from "express";

const router = Router()

router.post('/clients', createClient)
router.get('/clients/:id', getClient)

router.post('/rooms', createRoom)
router.get('/rooms/:id', getRoom)

export default router