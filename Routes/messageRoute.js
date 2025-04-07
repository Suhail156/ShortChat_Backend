import express from 'express';
import { createMessage, getMessages ,getMessagesBetweenUsers} from '../Controller/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', createMessage)
router.get('/:user1([a-zA-Z0-9]+)/:user2([a-zA-Z0-9]+)', getMessagesBetweenUsers);


export default router;