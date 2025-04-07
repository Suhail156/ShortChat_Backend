import express from 'express'
import { login, signup,getAllUsers } from '../Controller/userController.js'

const router =express.Router()


router.post('/signup',signup)
router.post('/login',login)
router.get("/all", getAllUsers);


export default router