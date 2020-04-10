import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import crypto from 'crypto';

import User, { IUser } from '../models/User';

async function signUpController(req: Request, res: Response) {
    const user = req.body as IUser;
    const password = await bcrypt.hash(user.password, 10);
    try {
        const newUser = await User.put({
            username: user.username,
            password,
            apiKey: crypto.randomBytes(30).toString('hex'),
        });
        delete newUser.password;
        res.status(HttpStatus.CREATED).send({user: newUser});
    } catch (e) {
        console.error(e);
        res.status(HttpStatus.BAD_REQUEST).send({
            errors: {
                field: 'username',
                message: 'User already exists',
            }
        })
    }
}

export default signUpController;
