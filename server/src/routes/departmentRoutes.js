// CONCEPT: a Router is a "mini app" holding the routes of one resource.
// router.route(path) groups several methods on the same path.
const router = require('express').Router();
const c = require('../controllers/departmentController');

// Paths are relative to /api/departments (set in app.js)
router.route('/').get(c.getDepartments).post(c.createDepartment);
router.route('/:id').delete(c.deleteDepartment).put(c.updateDepartment);

module.exports = router;
