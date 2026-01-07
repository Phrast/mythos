const userRepository = require('../repositories/userRepository');

const VALID_ROLES = ['USER', 'EXPERT', 'ADMIN'];

const getAllUsers = async () => {
  return await userRepository.findAll();
};

const updateUserRole = async (userId, newRole) => {
  if (!VALID_ROLES.includes(newRole)) {
    throw new Error('Invalid role');
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await userRepository.updateRole(userId, newRole);
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

module.exports = {
  getAllUsers,
  updateUserRole
};
