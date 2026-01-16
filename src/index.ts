import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello, World! CI/CD is working! ');
});

app.get('/getRandomNumber', (req, res) => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    res.json({ number: randomNumber });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});