import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/db';
import bcrypt from 'bcryptjs';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`AI Resume Builder API server running on http://${HOST}:${PORT}`);
  console.log(`Health check available at: http://${HOST}:${PORT}/api/health`);

  // Non-blocking database connection & idempotent initialization probe on boot (NO secrets printed)
  (async () => {
    try {
      if (!process.env.DATABASE_URL) {
        console.warn('⚠️ [Database Boot Diagnostic] DATABASE_URL is not set in environment.');
        return;
      }

      try {
        const parsed = new URL(process.env.DATABASE_URL);
        console.log(`[Database Boot Diagnostic] Target: protocol=${parsed.protocol} host=${parsed.hostname} db=${parsed.pathname.replace(/^\//, '')} sslmode=${parsed.searchParams.get('sslmode') || 'unspecified'}`);
      } catch {
        console.log('[Database Boot Diagnostic] Target: DATABASE_URL present (non-standard URL format)');
      }

      await prisma.$connect();
      const count = await prisma.template.count();
      console.log(`✅ [Database Boot Diagnostic] Database connected successfully! Active templates in DB: ${count}`);

      // Safe idempotent check for admin account on startup
      const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@resumebuilder.local';
      const existingAdmin = await prisma.adminUser.findUnique({
        where: { email: adminEmail.toLowerCase().trim() }
      });

      if (!existingAdmin) {
        const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminSecurePassword2026!';
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        await prisma.adminUser.create({
          data: {
            email: adminEmail.toLowerCase().trim(),
            password: hashedPassword,
            name: 'System Administrator',
            role: 'SUPER_ADMIN'
          }
        });
        console.log(`[Database Boot Diagnostic] Created default admin account (${adminEmail}) safely.`);
      } else {
        console.log(`[Database Boot Diagnostic] Admin account verified (${adminEmail}).`);
      }
    } catch (err: any) {
      const errorName = err?.name || 'DatabaseError';
      const errorCode = err?.code || 'UNKNOWN';
      const rawMsg = typeof err?.message === 'string' ? err.message.split('\n')[0] : 'Connection failed';
      const sanitizedMsg = rawMsg.replace(/:\/\/[^@]+@/gi, '://***:***@');
      console.error(`❌ [Database Boot Diagnostic] Connection failed: Type=${errorName}, Code=${errorCode}, Details=${sanitizedMsg}`);
    }
  })();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
