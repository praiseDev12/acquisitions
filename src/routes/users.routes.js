import express from 'express';
import { fetchAllUsers, getUserById, updateUser, deleteUser } from '#controllers/users.controller.js';
import { authenticate } from '#middleware/auth.middleware.js';

const router = express.Router();

// Public route - get all users (you might want to add authentication here too)
router.get('/', fetchAllUsers);

// Protected routes - require authentication
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
