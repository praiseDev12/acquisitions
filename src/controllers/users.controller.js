import logger from '#config/logger.js';
import { getAllUsers, getUserById as getUserByIdService, updateUser as updateUserService, deleteUser as deleteUserService } from '#services/users.service.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting all users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error('users.controller.js Error: fetching all users', e);
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    logger.info(`Getting user by ID: ${req.params.id}`);

    // Validate the request parameters
    const validationResult = userIdSchema.safeParse(req.params);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const user = await getUserByIdService(id);

    res.json({
      message: 'Successfully retrieved user',
      user: user,
    });
  } catch (e) {
    logger.error(`users.controller.js Error: getting user by ID ${req.params.id}`, e);
    
    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    logger.info(`Updating user: ${userId}`);

    // Validate the request parameters
    const paramValidation = userIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramValidation.error),
      });
    }

    // Validate the request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = paramValidation.data;
    const updates = bodyValidation.data;
    
    // Authorization checks
    // Users can only update their own information
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information'
      });
    }

    // Only admins can change roles
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles'
      });
    }

    const updatedUser = await updateUserService(id, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error(`users.controller.js Error: updating user ${req.params.id}`, e);
    
    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    logger.info(`Deleting user: ${userId}`);

    // Validate the request parameters
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    
    // Authorization checks
    // Users can only delete their own account or admins can delete any account
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account'
      });
    }

    // Prevent users from deleting themselves if they're the only admin
    if (req.user.role === 'admin' && req.user.id === id) {
      // This is a basic check - in production you might want to ensure there's at least one admin left
      logger.warn(`Admin user ${id} attempting to delete their own account`);
    }

    const result = await deleteUserService(id);

    res.json({
      message: 'User deleted successfully',
      result: result,
    });
  } catch (e) {
    logger.error(`users.controller.js Error: deleting user ${req.params.id}`, e);
    
    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    next(e);
  }
};
