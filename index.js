const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/userRoutes');
const lessonRouter = require('./src/routes/lessonRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


// Load environment variables from .env file
dotenv.config();

// create our app
const app = express();
app.use(express.json());
app.use(cookieParser());


// Middleware to enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://react-teach-hub.vercel.app'
];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

app.use(cors({
  origin: ['http://localhost:5173', 'https://react-teach-hub.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // علشان الكوكيز تشتغل
}));

// app.options('*', cors()); // علشان preflight requests تعدي

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/users', userRouter);
app.use('/api/lessons', lessonRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
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