const mongoose = require('mongoose');

// CONCEPT: schema validation. These rules run on create() and save(),
// and on findByIdAndUpdate() only when we pass { runValidators: true }.
// A broken rule throws a ValidationError -> errorHandler.js -> 400 with every message.
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    salary: {
      type: Number, // "25000" (a string) is cast to 25000; "abc" fails with a CastError
      required: [true, 'Salary is required'],
      min: [1000, 'Salary must be at least 1000'],
    },
    // A reference to another document: like a foreign key
    // CONCEPT: embed vs reference.
    //   embed     -> put the department object inside every employee (fast reads, duplicated data)
    //   reference -> store only the department _id (one source of truth) and join with populate()
    // We reference, because a department is shared by many employees and can be renamed.
    // NOTE: MongoDB does NOT enforce this reference. That is why the controller checks it.
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department', // the model name populate() will look in
      required: [true, 'Department is required'],
    },
    hireDate: {
      type: Date,
      default: Date.now, // the function itself (no parentheses): called for each new document
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
