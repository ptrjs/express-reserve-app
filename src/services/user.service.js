const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const userBody2 = userBody;
  userBody2.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody2,
  });
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  console.log(`Fetching user with id: ${id}`);
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

// const getUserById = async (id) => {
//   console.log(`Fetching user with id: ${id}`);
//   const user = await prisma.user.findUnique({ where: { id } });
//   if (!user) {
//     console.log(`User not found with id: ${id}`);
//   }
//   return user;
// };

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Determine if user is taken or not
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (email) => {
  const user = await getUserByEmail(email);
  return !!user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateBody,
  });

  return updateUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const deleteUsers = await prisma.user.deleteMany({
    where: {
      id: userId,
    },
  });

  return deleteUsers;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
