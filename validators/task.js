import { check } from 'express-validator';

const taskValidators = {
  createTaskValidator: [
    check('title')
      .notEmpty().withMessage('Title is required').bail()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3-100 characters'),

    check('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

    check('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Completed']).withMessage('Invalid status'),

    check('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),

    check('dueDate')
      .notEmpty().withMessage('Due date is required').bail()
      .isISO8601().withMessage('Invalid date format, use YYYY-MM-DD or ISO8601 format'),

    check('assignedTo')
      .optional()
      .isMongoId().withMessage('Invalid user ID format'),

    check('image')
      .optional()
      .isURL().withMessage('Invalid image URL format')
  ]
};

export default taskValidators;
