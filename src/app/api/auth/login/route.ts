import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign, SignOptions } from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: {
        roles: true,
        permissions: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        roles: user.roles.map((r: { name: string }) => r.name),
        permissions: user.permissions.map((p: { name: string }) => p.name)
      },
      process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );
    
    // Generate refresh token
    const refreshToken = sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this-in-production',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' } as SignOptions
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Calculate token expiration time in seconds
    const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((r: { name: string }) => r.name),
        permissions: user.permissions.map((p: { name: string }) => p.name),
        lastLogin: new Date().toISOString(),
        isActive: true,
        isEmailVerified: true,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token,
      refreshToken,
      expiresIn
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 