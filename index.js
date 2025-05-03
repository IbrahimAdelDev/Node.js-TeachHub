const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/db');
const userRouter = require('./src/routes/userRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// Load environment variables from .env file
dotenv.config();

// create our app
const app = express();
app.use(express.json());
app.use(cookieParser());

// connecting to the database
connectDB();


// Middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use('/api/users', userRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/', (req, res) => {
  res.send(`user: hima, email: hima@ex.com`);
});

// Open the server on the port specified in the .env file
app.listen( process.env.PORT , () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
