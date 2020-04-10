import { Request, Response } from 'express';
import Comment, { ApiKeyError } from '../models/Comment';
import { IUser } from '../models/User';
import HttpStatus from 'http-status-codes';

const commentController = {
    async get(req: Request, res: Response) {
        const user = req.user as IUser;
        if (user.id) {
            try {
                const comments = await Comment.getByUserId(user.id);
                res.send(comments);
            } catch (e) {
                res.status(HttpStatus.BAD_REQUEST).send();
            }
        }
    },
    async post(req: Request, res: Response) {
        try {
            const comment = await Comment.putByApiKey(req.body.comment, req.body.apiKey);
            res.status(HttpStatus.CREATED).send(comment);
        } catch (e) {
            if (e instanceof ApiKeyError) {
                res.status(HttpStatus.BAD_REQUEST).send(e.message);
            } else {
                console.error(e);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    }
};

export default commentController;
