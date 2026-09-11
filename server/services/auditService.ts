import { AuditLog, UserRole } from '../db/schema.js';
import { dbStore } from '../db/store.js';

export class AuditService {
  public static log(params: {
    userId: string;
    userName: string;
    role: UserRole;
    action: string;
    module: string;
    details: string;
    ipAddress?: string;
    status?: 'Success' | 'Failed' | 'Warning';
  }): AuditLog {
    const data = dbStore.getData();
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: params.userId,
      userName: params.userName,
      role: params.role,
      action: params.action,
      module: params.module,
      details: params.details,
      ipAddress: params.ipAddress || '127.0.0.1',
      status: params.status || 'Success',
      timestamp: new Date().toISOString(),
    };

    data.auditLogs.unshift(log); // newest first
    // Limit to last 500 logs
    if (data.auditLogs.length > 500) {
      data.auditLogs = data.auditLogs.slice(0, 500);
    }
    dbStore.persist();
    return log;
  }
}
