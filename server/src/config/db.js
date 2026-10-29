const mongoose = require('mongoose');

// Connects once at startup. If it fails there is no point running the API.
// CONCEPT: Mongoose keeps ONE connection pool for the whole app. Models use it automatically,
// so we never pass the connection around.
//
// The connection string (in .env):
//   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/employeehub?retryWrites=true&w=majority
//                                                           ^^^^^^^^^^^ database name
//   Without a database name, MongoDB uses one called "test".
//
// DEMO (common Atlas errors):
//   wrong password            -> "bad auth : authentication failed"
//   IP not in Network Access  -> "Could not connect to any servers in your MongoDB Atlas cluster"
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // exit code 1 = "failed"; node --watch / hosting platforms show it clearly
  }
}

module.exports = connectDB;
