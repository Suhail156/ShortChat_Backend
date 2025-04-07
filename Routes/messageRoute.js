import express from 'express';
import { createMessage, getMessages ,getMessagesBetweenUsers} from '../Controller/messageController.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', createMessage)
router.get('/:user1/:user2', getMessagesBetweenUsers);


export default router;