import db from '../db';
import { IUser } from './User';

interface IComment {
    id: number,
    name: string,
    surname: string,
    comment: string,
    user_id: number,
}

export class ApiKeyError extends Error {
    constructor(public message: string) {
        super();
    }
}

const Comment = {
    getByUserId(user_id: number): Promise<IComment[]> {
        return new Promise<IComment[]>((resolve, reject) => {
            const sql = 'SELECT * FROM comment WHERE user_id = ?';
            db.all(sql, [user_id], (err, rows) => {
                if (err) reject(err);
                else {
                    resolve(rows);
                }
            });
        });
    },
    putByApiKey(comment: IComment, apiKey: number): Promise<IComment> {
        return new Promise<IComment>((resolve, reject) => {
            const sql = 'SELECT * FROM user WHERE apiKey = ?';
            db.all(sql, [apiKey], ((err, rows) => {
                if (err) reject(err);
                else {
                    if (rows.length === 0) {
                        reject(new ApiKeyError('Invalid api key'));
                        return;
                    }
                    const user = rows[0] as IUser;
                    const sql = 'INSERT INTO comment(name, surname, comment, user_id) VALUES (?, ?, ?, ?)';
                    db.all(sql, [comment.name, comment.surname, comment.comment, user.id], (err1) => {
                        if (err1) reject(err1);
                        else {
                            resolve(comment);
                        }
                    });
                }
            }));
        })
    }
};

export default Comment;
