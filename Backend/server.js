const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');
const http = require('http');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then((connection) => {
    console.log(`MongoDB Connected to database: ${connection.connections[0].name}`);
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- API ROUTES ---
app.use('/auth', require('./routes/authRoutes'));
app.use('/port-in', authMiddleware, require('./routes/portRoutes'));
app.use('/port-out', authMiddleware, require('./routes/portOutRoutes'));
app.use('/snapback', authMiddleware, require('./routes/snapbackRoutes'));
app.use('/subscribers', authMiddleware, require('./routes/subscriberRoutes'));
app.use('/dashboard', authMiddleware, require('./routes/dashboardRoutes'));
app.use('/complaints', authMiddleware, require('./routes/complaintRoutes'));
app.use('/export', authMiddleware, require('./routes/exportRoutes'));

app.use(errorHandler);
const server = http.createServer(app);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));