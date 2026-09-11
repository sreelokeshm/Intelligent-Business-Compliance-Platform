const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('compliance_auth_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('compliance_auth_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('compliance_auth_token');
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: { email: string; password?: string; role?: string }) =>
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => fetchWithAuth('/auth/me'),
    logout: () =>
      fetchWithAuth('/auth/logout', {
        method: 'POST',
      }),
  },

  business: {
    getAll: () => fetchWithAuth('/business'),
    getById: (id: string) => fetchWithAuth(`/business/${id}`),
    create: (data: any) =>
      fetchWithAuth('/business', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/business/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getPassport: (id: string) => fetchWithAuth(`/business/${id}/passport`),
  },

  requirements: {
    analyze: (profile: any) =>
      fetchWithAuth('/requirements/analyze', {
        method: 'POST',
        body: JSON.stringify(profile),
      }),
    getAll: () => fetchWithAuth('/requirements'),
    getById: (id: string) => fetchWithAuth(`/requirements/${id}`),
  },

  checklist: {
    get: (businessId?: string) =>
      fetchWithAuth(`/checklist${businessId ? `?businessId=${businessId}` : ''}`),
    update: (id: string, data: any) =>
      fetchWithAuth(`/checklist/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  documents: {
    get: (businessId?: string) =>
      fetchWithAuth(`/documents${businessId ? `?businessId=${businessId}` : ''}`),
    getById: (id: string) => fetchWithAuth(`/documents/${id}`),
    upload: (docData: any) =>
      fetchWithAuth('/documents', {
        method: 'POST',
        body: JSON.stringify(docData),
      }),
    verify: (id: string, status: 'Verified' | 'Rejected', remarks?: string) =>
      fetchWithAuth(`/documents/${id}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ status, remarks }),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/documents/${id}`, {
        method: 'DELETE',
      }),
  },

  applications: {
    get: (businessId?: string) =>
      fetchWithAuth(`/applications${businessId ? `?businessId=${businessId}` : ''}`),
    getById: (id: string) => fetchWithAuth(`/applications/${id}`),
    create: (data: any) =>
      fetchWithAuth('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (
      id: string,
      status: string,
      comment?: string,
      scheduleInspection?: boolean,
      decisionDocumentUrl?: string
    ) =>
      fetchWithAuth(`/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, comment, scheduleInspection, decisionDocumentUrl }),
      }),
    addComment: (id: string, message: string) =>
      fetchWithAuth(`/applications/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),
    review: (id: string, data: { status: string; remarks: string }) =>
      fetchWithAuth(`/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: data.status, comment: data.remarks }),
      }),
  },

  inspections: {
    get: (businessId?: string) =>
      fetchWithAuth(`/inspections${businessId ? `?businessId=${businessId}` : ''}`),
    getById: (id: string) => fetchWithAuth(`/inspections/${id}`),
    complete: (
      id: string,
      data: {
        result: 'Passed' | 'Failed' | 'Re-inspection Required';
        remarks: string;
        checklist?: any[];
        evidenceFiles?: any[];
      }
    ) =>
      fetchWithAuth(`/inspections/${id}/complete`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/inspections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    submitReport: (id: string, data: any) =>
      fetchWithAuth(`/inspections/${id}/complete`, {
        method: 'PUT',
        body: JSON.stringify({
          result: 'Passed',
          remarks: data.findings || data.recommendation || 'Completed on-site verification',
          checklist: data.checklistItems,
        }),
      }),
  },

  schemes: {
    getAll: () => fetchWithAuth('/schemes'),
    getById: (id: string) => fetchWithAuth(`/schemes/${id}`),
    checkEligibility: (id: string, businessId?: string) =>
      fetchWithAuth(`/schemes/${id}/check-eligibility`, {
        method: 'POST',
        body: JSON.stringify({ businessId }),
      }),
  },

  grievances: {
    get: (businessId?: string) =>
      fetchWithAuth(`/grievances${businessId ? `?businessId=${businessId}` : ''}`),
    create: (data: any) =>
      fetchWithAuth('/grievances', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    respond: (id: string, message: string, status?: string) =>
      fetchWithAuth(`/grievances/${id}/respond`, {
        method: 'POST',
        body: JSON.stringify({ message, status }),
      }),
  },

  notifications: {
    get: () => fetchWithAuth('/notifications'),
    markRead: (id: string) =>
      fetchWithAuth(`/notifications/${id}/read`, {
        method: 'PUT',
      }),
    markAllRead: () =>
      fetchWithAuth('/notifications/read-all', {
        method: 'PUT',
      }),
  },

  risk: {
    get: (businessId: string) => fetchWithAuth(`/risk/${businessId}`),
  },

  deadlines: {
    get: (businessId?: string) =>
      fetchWithAuth(`/deadlines${businessId ? `?businessId=${businessId}` : ''}`),
  },

  assistant: {
    chat: (query: string, businessId?: string) =>
      fetchWithAuth('/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({ query, businessId }),
      }),
  },

  admin: {
    getAnalytics: () => fetchWithAuth('/admin/analytics'),
    getStats: () => fetchWithAuth('/admin/analytics'),
    getUsers: () => fetchWithAuth('/admin/users'),
    createUser: (data: any) =>
      fetchWithAuth('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateUser: (id: string, data: any) =>
      fetchWithAuth(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getAuditLogs: () => fetchWithAuth('/admin/audit-logs'),
    getDepartments: () => fetchWithAuth('/admin/departments'),
    getSettings: () => fetchWithAuth('/admin/settings'),
    updateSettings: (data: any) =>
      fetchWithAuth('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getRules: () => fetchWithAuth('/requirements/rules'),
    createRule: (data: any) =>
      fetchWithAuth('/admin/rules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateRule: (id: string, data: any) =>
      fetchWithAuth(`/admin/rules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};
