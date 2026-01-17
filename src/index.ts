import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Todo API is running!', status: 'healthy' });
});

// Get random number (existing endpoint)
app.get('/num', (req, res) => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    res.json({ number: randomNumber });
});

// CRUD Endpoints for Todos

// Create a new todo
app.post('/todos', async (req, res) => {
    try {
        const { title } = req.body;
        const todo = await prisma.todo.create({
            data: { title }
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Get a single todo
app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await prisma.todo.findUnique({
            where: { id: parseInt(id) }
        });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todo' });
    }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const todo = await prisma.todo.update({
            where: { id: parseInt(id) },
            data: { title, completed }
        });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.todo.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});