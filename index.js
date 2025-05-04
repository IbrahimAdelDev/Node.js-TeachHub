const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/db');
const userRouter = require('./src/routes/userRoutes');
const lessonRouter = require('./src/routes/lessonRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// Load environment variables from .env file
dotenv.config();

// create our app
const app = express();
app.use(express.json());
app.use(cookieParser());


// Middleware to enable CORS
app.use(cors({
  // origin: 'http://localhost:3000', // Replace with your frontend URL
  origin: '*', // Allow all origins (for development purposes only)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use('/api/users', userRouter);
app.use('/api/lessons', lessonRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/', (req, res) => {
  res.send(`user: hima, email: hima@ex.com`);
});

// connect to the database and start the server
(async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Error in running the server: ', error.message);
    process.exit(1);
  }
})(); 