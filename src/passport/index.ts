import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';

passport.use('local', new LocalStrategy(
    async (username, password, done) => {
        const user = await User.get({username});
        if (user as IUser[] && user?.length) {
            const isValid = await bcrypt.compare(password, user[0].password);
            if (isValid) {
                done(null, user[0]);
                return;
            }
        }
        done(null, false, { message: 'Incorrect username or password'});
    }
));

function mustAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        return res.status(HttpStatus.UNAUTHORIZED).send({});
    }
    return next();
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user)
});

export { mustAuthenticated, passport };
