const mongoose = require('mongoose');

// CONCEPT: MongoDB stores DOCUMENTS (JSON-like objects) in COLLECTIONS.
//   SQL table  ~ collection      row ~ document      column ~ field
// MongoDB itself has no fixed schema. Mongoose adds one in our code, so every document
// we save has the same shape and passes the same rules.
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'], // [rule, custom message]
      trim: true, // '  IT  ' is saved as 'IT'
      // unique creates a UNIQUE INDEX in MongoDB. It is NOT a validator:
      // a duplicate is rejected by the database with error code 11000,
      // which errorHandler.js turns into 409 Conflict.
      unique: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// mongoose.model('Department', ...) -> collection name "departments" (lower-case, plural).
// Every document also gets _id (an ObjectId) and __v (a version key) automatically.
module.exports = mongoose.model('Department', departmentSchema);
