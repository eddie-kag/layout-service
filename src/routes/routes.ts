import { createClient, getClient } from "@controllers/controllers";
import { Router } from "express";

const router = Router()

router.post('/clients', createClient)
router.get('/clients/:id', getClient)

export default router