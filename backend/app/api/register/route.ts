import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { initializeDatabase } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    initializeDatabase();

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const db = getDb();

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username, email, hashedPassword);

    const userId = result.lastInsertRowid;

    db.prepare(
      'INSERT INTO portfolios (user_id, name, title, bio) VALUES (?, ?, ?, ?)'
    ).run(userId, '', '', '');

    return NextResponse.json(
      { message: 'User created successfully', userId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
