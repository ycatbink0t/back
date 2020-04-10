import db from '../db';
import { getWhereString, IParams } from '../db/utils';

export interface IUser {
    id?: number,
    username: string,
    password: string,
    apiKey: string,
}

const User = {
    get(user: Partial<IUser>): Promise<IUser[]> {
        return new Promise<IUser[]>((resolve, reject) => {
            const [where, values] = getWhereString(user as IParams);
            db.all('SELECT * FROM user' + where, values, ((err, rows) => {
                if (err) reject(err);
                else {
                    resolve(rows);
                }
            }));
        })
    },

    put(user: IUser): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            const sql = 'INSERT INTO user(username, password, apiKey) VALUES (?, ?, ?)';
            db.all(sql, [user.username, user.password, user.apiKey], (err) => {
                if (err) reject(err);
                else {
                    resolve(user);
                }
            });
        });
    }
};

export default User;
