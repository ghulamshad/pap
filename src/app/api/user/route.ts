import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticate } from '@/middleware/auth';
import { assignRoleToUser } from '@/utils/rbac';

export async function GET(request: Request) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        roles: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    const user = await db.user.create({
      data: {
        email,
        password, // Note: In a real app, you should hash the password
        name,
        role: role || 'USER',
      },
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authResponse = await authenticate(request as any, ['users:update']);
  if (authResponse) return authResponse;

  try {
    const { id, email, name, role } = await request.json();
    
    const user = await db.user.update({
      where: { id },
      data: {
        email,
        name,
        role,
      },
    });

    // Update user's permissions based on new role
    if (role) {
      await assignRoleToUser(id, role);
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authResponse = await authenticate(request as any, ['users:delete']);
  if (authResponse) return authResponse;

  try {
    const { id } = await request.json();
    
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 