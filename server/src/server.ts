import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    response.json({
        alive: true
    });
    console.log('hit');
});

app.listen(3333);