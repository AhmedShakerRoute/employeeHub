// npm run seed  -> wipes the collections and inserts sample data
// CONCEPT: a seed script gives every trainee the SAME starting data, so the demo
// requests and the screenshots match. Run it again any time to reset the database.
require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('../src/models/Department');
const Employee = require('../src/models/Employee');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // deleteMany({}) with an empty filter = delete every document in the collection
  await Employee.deleteMany({});
  await Department.deleteMany({});

  // create() with an array returns the saved documents, so we get their new _id values.
  // Array destructuring gives each one a name.
  const [it, hr, finance] = await Department.create([{ name: 'IT' }, { name: 'HR' }, { name: 'Finance' }]);

  await Employee.create([
    { name: 'Ahmed Ali', jobTitle: 'Developer', salary: 25000, department: it._id },
    { name: 'Sara Adel', jobTitle: 'QA Engineer', salary: 17000, department: it._id },
    { name: 'Mona Hassan', jobTitle: 'Recruiter', salary: 18000, department: hr._id },
    { name: 'Omar Khaled', jobTitle: 'Accountant', salary: 20000, department: finance._id },
  ]);

  console.log('Seeded 3 departments and 4 employees');
  await mongoose.disconnect(); // close the connection so the script can exit
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
