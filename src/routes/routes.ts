import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router()

router.get('/ping', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('pong')
})

export default router