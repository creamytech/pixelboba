import { prisma } from './prisma';

export async function createAuditLog({
  userId,
  action,
  entityType,
  entityId,
  changes,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
