import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { MemoryStore } from 'express-session';
require('dotenv').config();

import { mustAuthenticated, passport } from './passport';
import signUpRouter from './routes/sign-up';
import commentRouter from './routes/comment';

const app = express();
app.disable('x-powered-by');

const sessionMiddleware = session({
    secret: process.env.SECRET || 'test',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: new MemoryStore(),
});

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/sign-up', signUpRouter);
app.use('/comment', commentRouter);
app.post('/sign-in', passport.authenticate('local', { session: true }),
    (req, res) => {
        res.send(req.user);
});
app.post('/sign-out', mustAuthenticated, (req, res) => {
    req.logOut();
    res.send({});
});

export default app;
