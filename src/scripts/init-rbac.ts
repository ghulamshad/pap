import { db } from '@/lib/db';
import { initializeRBAC } from '@/utils/rbac';

async function main() {
  try {
    console.log('Initializing RBAC system...');
    await initializeRBAC();
    console.log('RBAC system initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize RBAC system:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main(); 