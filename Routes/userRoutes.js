import { Router } from "express";
import { createUser, getUser, loginUser } from "../Controllers/userController.js";
import { verifyJWT } from "../Middleware/jwtMiddleware.js";


const router = Router()

router.post('/user', createUser)
router.get("/user", verifyJWT, getUser)
router.post('/userlogin', loginUser)

export default router