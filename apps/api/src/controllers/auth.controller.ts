import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Full name is required.' });
      return;
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // Check if user already exists
    const [existingUser, existingAdmin] = await Promise.all([
      prisma.user.findUnique({ where: { email: cleanEmail } }),
      prisma.adminUser.findUnique({ where: { email: cleanEmail } })
    ]);

    if (existingUser || existingAdmin) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        passwordHash,
        role: 'USER',
        profile: {
          create: {
            personalInfo: {
              fullName: cleanName,
              email: cleanEmail
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_12345';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      jwtSecret,
      { expiresIn: '30d' }
    );

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('user_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const cleanEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

    // Check normal user table first
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_12345';
    const isProd = process.env.NODE_ENV === 'production';

    if (user) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      }).catch(() => {});

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        jwtSecret,
        { expiresIn: '30d' }
      );

      res.cookie('user_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      });
      return;
    }

    // Check admin user table
    const admin = await prisma.adminUser.findUnique({
      where: { email: cleanEmail }
    });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          createdAt: admin.createdAt
        }
      });
      return;
    }

    res.status(401).json({ error: 'Invalid credentials.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    if (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN') {
      const admin = await prisma.adminUser.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true, createdAt: true }
      });

      if (admin) {
        res.json({ user: admin });
        return;
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User account not found.' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

export function logout(_req: Request, res: Response): void {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax'
  };

  res.clearCookie('user_token', cookieOpts);
  res.clearCookie('admin_token', cookieOpts);

  res.json({ success: true, message: 'Logged out successfully.' });
}
