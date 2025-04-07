import express from 'express'
import { login, signup,getAllUsers } from '../Controller/userController.js'
import { verifytoken } from '../Middleware/userAuthentication.js'

const router =express.Router()


router.post('/signup',signup)
router.post('/login',login)
router.use(verifytoken)
router.get("/all", getAllUsers);


export default router