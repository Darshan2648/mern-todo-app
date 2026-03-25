const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Get tasks with pagination, filtering, sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const { status, sort, page = 1, limit = 10 } = req.query;
        let query = { user: req.user.id };

        // Filtering
        if (status) query.status = status;

        let mongooseQuery = Task.find(query);

        // Sorting
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            mongooseQuery = mongooseQuery.sort(sortBy);
        } else {
            mongooseQuery = mongooseQuery.sort('-createdAt'); // default sort
        }

        // Pagination
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const startIndex = (parsedPage - 1) * parsedLimit;

        mongooseQuery = mongooseQuery.skip(startIndex).limit(parsedLimit);

        const tasks = await mongooseQuery;
        const total = await Task.countDocuments(query);

        res.status(200).json({
            count: tasks.length,
            total,
            page: parsedPage,
            pages: Math.ceil(total / parsedLimit),
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { title, description, status } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            user: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check for user ownership
        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized to update this task');
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check for user ownership
        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized to delete this task');
        }

        await task.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
