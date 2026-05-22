import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user with organization
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hwte.com' },
    update: {},
    create: {
      email: 'admin@hwte.com',
      name: '系統管理員',
      password: hashedPassword,
      organization: {
        create: {
          name: '研發處',
          code: 'RD'
        }
      }
    },
    include: { organization: true }
  });

  // Create default roles
  const roles = ['PMO_ADMIN', 'DIRECTOR', 'PM', 'TL', 'MEMBER', 'VIEWER'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} 角色`
      }
    });
  }

  // Create PMO_ADMIN full permissions
  const pmoAdminRole = await prisma.role.findUnique({ where: { name: 'PMO_ADMIN' } });
  if (pmoAdminRole) {
    const resources = ['user', 'organization', 'division', 'department', 'team', 'project', 'task', 'document', 'approval', 'requirement', 'test'];
    const actions = ['create', 'read', 'update', 'delete', 'approve'];
    for (const resource of resources) {
      for (const action of actions) {
        await prisma.permission.upsert({
          where: {
            roleId_resource_action: {
              roleId: pmoAdminRole.id,
              resource,
              action
            }
          },
          update: {},
          create: { resource, action, roleId: pmoAdminRole.id }
        });
      }
    }
  }

  // Create USER role permissions
  const userRole = await prisma.role.findUnique({ where: { name: 'MEMBER' } });
  if (userRole) {
    const resources = ['project', 'task', 'document'];
    for (const resource of resources) {
      await prisma.permission.upsert({
        where: {
          roleId_resource_action: {
            roleId: userRole.id,
            resource,
            action: 'read'
          }
        },
        update: {},
        create: { resource, action: 'read', roleId: userRole.id }
      });
    }
  }

  // Assign PMO_ADMIN role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId_scope_scopeId: {
        userId: admin.id,
        roleId: pmoAdminRole!.id,
        scope: 'SYSTEM',
        scopeId: null as any
      }
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: pmoAdminRole!.id,
      scope: 'SYSTEM'
    }
  });

  console.log('Seed completed');
  console.log('Admin user: admin@hwte.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());