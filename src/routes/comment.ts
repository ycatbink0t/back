import { Router } from 'express';
import commentController from '../controllers/comment';
import { mustAuthenticated } from '../passport';
import { body } from 'express-validator';

const commentRouter = Router();

commentRouter.get('', mustAuthenticated, commentController.get);
commentRouter.post('', [
    body('apiKey').exists(),
    body('comment').exists().isJSON(),
    body('comment.comment').exists()
], commentController.post);


export default commentRouter;
