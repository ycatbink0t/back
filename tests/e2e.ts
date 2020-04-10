import request from 'supertest';
import app from '../src/app';
import HttpStatus from 'http-status-codes'
import * as Http from 'http';
const agent = request.agent(app);
let server: Http.Server;

function serverReady(): Promise<void> {
    return new Promise<void>(resolve => {
        // @ts-ignore
        if (server.address) { resolve() }
        else {
            server.on('listening', () => resolve());
        }
    })
}

let newUserStub: any = {
    username: 'username',
    password: 'password123qwe',
};

describe('Sign up test', () => {
    it('Should return user with username', async () => {
        const res = await agent
            .post('/sign-up')
            .send(newUserStub);
        expect(res.status).toBe(HttpStatus.CREATED);
        expect(res.body).toHaveProperty('user');
        newUserStub.apiKey = res.body.user.apiKey;
    });
});

describe('Sign in test', () => {
    it('Should login', async () => {
        const res = await agent
            .post('/sign-in')
            .send(newUserStub);
        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body).toHaveProperty('username');
    });
});

describe('Add comment test', () => {
    it('Should add comment', async () => {
        const res = await agent
            .post('/comment')
            .send({
                comment: {
                    name: 'name',
                    surname: 'surname',
                    comment: 'comment',
                },
                apiKey: newUserStub.apiKey,
            });
        expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it('Should fail add comment', async () => {
        const res = await agent
            .post('/comment')
            .send({
                comment: {
                    name: 'a',
                    surname: 'b',
                    comment: 'c'
                },
                apiKey: '123'
            });
        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
});

describe('Get comments', () => {
    it('Should get comments', async () => {
        const res = await agent
            .get('/comment')
            .send();
        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.body).toHaveProperty('length');
    });
});

beforeAll(async () => {
    server = app.listen(3000, () => {
        console.log('app listening on port 3000');
    });
    await serverReady();
});

afterAll(() => {
    server.close();
});
