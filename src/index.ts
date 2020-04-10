import app from './app';

const listener = app.listen(process.env.APP_PORT || 3000, () => {
    console.log('Server listening on ', listener.address());
});
