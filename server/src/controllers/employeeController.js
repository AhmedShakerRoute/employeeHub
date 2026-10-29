// =====================================================================
// Employee controller (Session 2): the same CRUD as Session 1, now on MongoDB.
//
// CONCEPT: every Mongoose call goes over the network to Atlas, so it returns a Promise.
// `await` pauses THIS function (not the whole server) until the answer arrives.
// Meanwhile the event loop keeps serving other requests.
// =====================================================================
const Employee = require('../models/Employee');
const Department = require('../models/Department');

// Business rule shared by create and update: the department must exist.
// (The schema only checks that department LOOKS like an ObjectId, not that it exists.)
async function assertDepartmentExists(departmentId) {
  const exists = await Department.exists({ _id: departmentId });
  if (!exists) {
    // An error with a statusCode: errorHandler.js sends it as 400 with this message.
    const err = new Error(`Department ${departmentId} not found`);
    err.statusCode = 400;
    throw err;
  }
}

// Only these fields may come from the client (never _id, createdAt, ...)
// CONCEPT: mass assignment. Employee.create(req.body) would save ANY field the client sends.
function pickEmployeeFields(body = {}) {
  const { name, jobTitle, salary, department, hireDate } = body;
  return { name, jobTitle, salary, department, hireDate };
}

// GET /api/employees?department=<id>&search=ali&page=1&limit=10
exports.getEmployees = async (req, res) => {
  const { department, search } = req.query;
  // Pagination with safe defaults: page >= 1, and at most 50 items per page.
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);

  // Build the filter object step by step; {} means "no filter".
  const filter = {};
  if (department) filter.department = department;
  if (search) filter.name = { $regex: search, $options: 'i' }; // contains, ignore case

  // CONCEPT: Promise.all runs both queries IN PARALLEL and waits for both,
  // instead of waiting for the first before starting the second.
  const [items, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name') // bring the department name, like .Include()
      .sort('name')
      .skip((page - 1) * limit) // page 3 with limit 10 -> skip 20
      .limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
};

// GET /api/employees/:id
// CONCEPT: populate() replaces the stored department _id with the real department document:
//   before: "department": "665f1c..."
//   after:  "department": { "_id": "665f1c...", "name": "IT" }
// DEMO: remove .populate(...) and show the difference in Postman.
exports.getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('department', 'name');
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  const data = pickEmployeeFields(req.body);
  if (data.department) await assertDepartmentExists(data.department);
  const employee = await Employee.create(data); // schema validation runs here
  await employee.populate('department', 'name');
  res.status(201).json(employee);
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  const data = pickEmployeeFields(req.body);
  if (data.department) await assertDepartmentExists(data.department);
  const employee = await Employee.findByIdAndUpdate(req.params.id, data, {
    new: true, // return the document AFTER the update
    runValidators: true, // run schema rules on update too (off by default!)
  }).populate('department', 'name');
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.status(204).send()
};
