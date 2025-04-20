import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function authenticate(request: Request, requiredPermissions: string[] = []) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production') as any;
    
    // Get user with permissions
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: { permissions: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    // Check if user has required permissions
    if (requiredPermissions.length > 0) {
      const userPermissions = user.permissions.map(p => p.name);
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission) || user.role === 'ADMIN'
      );
      
      if (!hasAllPermissions) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    // Set user ID in request headers for downstream use
    const headers = new Headers(request.headers);
    headers.set('x-user-id', user.id);
    
    // Create a new request with the updated headers
    const authenticatedRequest = new Request(request.url, {
      method: request.method,
      headers,
      body: request.body,
    });
    
    // Replace the original request with the authenticated one
    Object.assign(request, authenticatedRequest);
    
    return null; // Authentication successful
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
} 