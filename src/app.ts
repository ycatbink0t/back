import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { MemoryStore } from 'express-session';
require('dotenv').config();
import * as path from 'path';
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

app.all('', (req: Request, _res: Response, next) => {
    console.log(req.body, req.baseUrl, req.method);
    next();
});
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.use('/sign-up', signUpRouter);
app.use('/comment', commentRouter);
app.get('/me', mustAuthenticated, (req: Request, res: Response) => {
    res.send(req.user);
});
app.post('/sign-in', passport.authenticate('local', { session: true }),
    (req, res) => {
        res.send(req.user);
});
app.post('/logout', mustAuthenticated, (req, res) => {
    req.logOut();
    res.send({});
});

export default app;
