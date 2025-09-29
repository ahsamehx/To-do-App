import express from 'express';
import mongoose from 'mongoose';
import routes from './Routes/Routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
//DB Connection
mongoose.connect("mongodb://localhost:27017/")
    .then(() => console.log("Connected to MongoDB")).catch(err => console.error("Could not connect to MongoDB", err));

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the To-do App!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(routes);