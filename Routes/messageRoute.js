import express from 'express';
import { createMessage, getMessages, getMessagesBetweenUsers} from '../Controller/messageController.js';
import { verifytoken } from '../Middleware/userAuthentication.js';

const router = express.Router();
// router.use(verifytoken)

router.get('/', getMessages);
router.post('/', createMessage);
router.get('/:user1/:user2', getMessagesBetweenUsers); // ✅ Valid path

export default router;
