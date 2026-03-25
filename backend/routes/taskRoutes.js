const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.use(protect); // protect all task routes

router
    .route('/')
    .get(getTasks)
    .post(
        [
            check('title', 'Please add a title').not().isEmpty(),
        ],
        createTask
    );

router
    .route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
