import { Router } from 'express';
import { body } from 'express-validator';
import signUpController from '../controllers/sign-up';

const signUpRouter = Router();

signUpRouter.post('', [
    body('username').exists().isLength({min: 5, max: 50}),
    body('password').exists().isLength({min: 8, max: 255}),
], signUpController);

export default signUpRouter;
