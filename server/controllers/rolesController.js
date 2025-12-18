const prisma = require('../prisma/client');
// GET all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST assign role to user (admin only)
const assignRole = async (req, res) => {
  const { userId, roleName } = req.body;
  try {
    // check if role exists
    const role = await prisma.role.findUnique({ where: { name: roleName } });

    if (!role) {
      return res.status(404).send({ error: 'Role not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // check if user exists
    if (!user) {
      res.status(404).send({ error: 'User not found' });
    }

    // Assign role
    const userRole = await prisma.userRole.upsert({
      where: {
        user_id_role_id: { user_id: userId, role_id: role.id },
      },
      update: {},
      create: {
        user_id: userId,
        role_id: role.id,
      },
    });
    res.send('Role successfully assigned');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// DELETE role from user (admin only)
const removeRole = async (req, res) => {
  const { userId, roleName } = req.body;

  try {
    // check if role exists
    const role = await prisma.role.findUnique({ where: { name: roleName } });

    if (!role) {
      return res.status(404).send('Role not found');
    }

    await prisma.userRole.delete({
      where: {
        user_id_role_id: { user_id: userId, role_id: role.id },
      },
    });

    res.status(201).send('Role removed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllRoles,
  assignRole,
  removeRole,
};
