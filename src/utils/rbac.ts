import { db } from '@/lib/db';

// Default permissions for each role
const rolePermissions: Record<string, string[]> = {
  USER: [
    'users:read:own',
    'profile:read',
    'profile:update',
  ],
  EDITOR: [
    'users:read:own',
    'profile:read',
    'profile:update',
    'documents:read',
    'documents:create',
    'documents:update:own',
  ],
  MODERATOR: [
    'users:read:own',
    'profile:read',
    'profile:update',
    'documents:read',
    'documents:create',
    'documents:update:own',
    'users:read',
    'users:update',
  ],
  ADMIN: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'profile:read',
    'profile:update',
    'documents:read',
    'documents:create',
    'documents:update',
    'documents:delete',
    'roles:read',
    'roles:create',
    'roles:update',
    'roles:delete',
  ],
};

/**
 * Assigns default permissions to a user based on their role
 */
export async function assignRoleToUser(userId: string, role: string) {
  try {
    // Get default permissions for the role
    const permissions = rolePermissions[role] || rolePermissions.USER;
    
    // Find or create permissions
    const permissionRecords = await Promise.all(
      permissions.map(async (permissionName) => {
        const [resource, action] = permissionName.split(':');
        
        // Find existing permission or create new one
        let permission = await db.permission.findFirst({
          where: {
            name: permissionName,
          },
        });
        
        if (!permission) {
          permission = await db.permission.create({
            data: {
              name: permissionName,
              resource,
              action,
              description: `${action} ${resource}`,
            },
          });
        }
        
        return permission;
      })
    );
    
    // Connect permissions to user
    await db.user.update({
      where: { id: userId },
      data: {
        permissions: {
          connect: permissionRecords.map((p: { id: string }) => ({ id: p.id })),
        },
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error assigning role permissions:', error);
    return false;
  }
}

export async function checkPermission(userId: string, requiredPermission: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { permissions: true },
    });

    if (!user) {
      return false;
    }

    // Admin role has all permissions
    if (user.role === 'ADMIN') {
      return true;
    }

    // Check if user has the required permission
    return user.permissions.some((p: { name: string }) => p.name === requiredPermission);
  } catch (error) {
    console.error('Failed to check permission:', error);
    return false;
  }
}

export async function initializeRBAC() {
  // ... existing function body ...
} 