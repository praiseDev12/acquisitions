import { db } from '#src/config/database.js';
import logger from '#src/config/logger.js';
import { users } from '#src/models/user.model.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '#services/auth.service.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users', e);
    throw new Error('Error getting users', e);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      throw new Error('User not found');
    }

    return user[0];
  } catch (e) {
    logger.error(`Error getting user by ID ${id}`, e);
    throw new Error(e.message || 'Error getting user');
  }
};

export const updateUser = async (id, updates) => {
  try {
    // First check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error('User not found');
    }

    // Hash password if it's being updated
    const processedUpdates = { ...updates };
    if (updates.password) {
      processedUpdates.password = await hashPassword(updates.password);
    }

    // Update user with provided updates and set updated_at
    const updatedUser = await db
      .update(users)
      .set({
        ...processedUpdates,
        updated_at: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return updatedUser[0];
  } catch (e) {
    logger.error(`Error updating user ${id}`, e);
    throw new Error(e.message || 'Error updating user');
  }
};

export const deleteUser = async (id) => {
  try {
    // First check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (existingUser.length === 0) {
      throw new Error('User not found');
    }

    // Delete the user
    await db
      .delete(users)
      .where(eq(users.id, id));

    return { message: 'User deleted successfully' };
  } catch (e) {
    logger.error(`Error deleting user ${id}`, e);
    throw new Error(e.message || 'Error deleting user');
  }
};
