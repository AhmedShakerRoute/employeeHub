// The routes file only maps URL + method to a controller function. No logic here.
const router = require('express').Router();
const c = require('../controllers/employeeController');

// Paths here are relative to /api/employees (set in app.js)
router.route('/').get(c.getEmployees).post(c.createEmployee);
router.route('/:id').get(c.getEmployee).put(c.updateEmployee).delete(c.deleteEmployee);

module.exports = router;
