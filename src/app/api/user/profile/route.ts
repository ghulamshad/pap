import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authenticate } from '@/middleware/auth';
import { compare, hash } from 'bcryptjs';

export async function GET(request: Request) {
  try {
    // Authenticate the request
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    // Get the user ID from the authenticated request
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      );
    }

    // Fetch the user profile with roles and permissions
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
        permissions: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Authenticate the request
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    // Get the user ID from the authenticated request
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    // Fetch the current user
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    // Update name if provided
    if (name) {
      updateData.name = name;
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }

      updateData.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash and update new password
      const hashedPassword = await hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        roles: true,
        permissions: true,
      },
    });

    // Remove sensitive information
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 