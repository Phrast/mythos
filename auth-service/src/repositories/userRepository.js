const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

const findAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      reputation: true,
      createdAt: true
    }
  });
};

const create = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
};

const updateRole = async (id, role) => {
  return await prisma.user.update({
    where: { id },
    data: { role }
  });
};

module.exports = {
  findByEmail,
  findById,
  findAll,
  create,
  updateRole
};
