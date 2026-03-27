const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('csms_token');
  }

  private getOrgId(): number | null {
    const user = localStorage.getItem('csms_user');
    if (user) {
      try { return JSON.parse(user).organizationId; } catch { return null; }
    }
    return null;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
      localStorage.removeItem('csms_token');
      localStorage.removeItem('csms_user');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.error || 'Request failed');
    }
    // Backend wraps in { success, data } — unwrap
    return (json.data !== undefined ? json.data : json) as T;
  }

  private async requestRaw<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('csms_token');
      localStorage.removeItem('csms_user');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    const json = await res.json();
    if (!res.ok || json.success === false) throw new Error(json.error || 'Request failed');
    return json as T;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; admin: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    firstName: string; lastName: string; email: string; password: string;
    organizationName: string; organizationType: string;
    username?: string; orgAddress?: string; orgEmail?: string; orgPhone?: string; plan?: string;
  }) {
    return this.request<{ token: string; admin: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        username: data.username || data.email,
        orgName: data.organizationName,
        orgType: data.organizationType,
        orgAddress: '',
        orgEmail: data.email,
        orgPhone: '',
        plan: data.plan || 'free_trial',
      }),
    });
  }

  async getMe() {
    const res = await this.request<{ admin: any }>('/auth/profile');
    return res.admin;
  }

  async updateProfile(data: { firstName: string; lastName: string; email: string }) {
    return this.request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  async updatePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request<any>('/auth/password', { method: 'PUT', body: JSON.stringify(data) });
  }

  async updateOrganization(data: { name: string; address: string; contactEmail: string; contactPhone: string }) {
    return this.request<any>('/auth/organization', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Users — scoped by org
  async getUsers() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/users?org_id=${orgId}`);
  }

  async getUser(id: number) {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(data: any) {
    const orgId = this.getOrgId();
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify({ ...data, organizationId: orgId }),
    });
  }

  async updateUser(id: number, data: any) {
    return this.request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, { method: 'DELETE' });
  }

  // Devices
  async getDevices() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/devices?org_id=${orgId}`);
  }

  async createDevice(data: any) {
    const orgId = this.getOrgId();
    return this.request<any>('/devices', {
      method: 'POST',
      body: JSON.stringify({ ...data, organizationId: orgId }),
    });
  }

  async updateDevice(id: number, data: any) {
    return this.request<any>(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteDevice(id: number) {
    return this.request<any>(`/devices/${id}`, { method: 'DELETE' });
  }

  // Attendance — scoped by org via path param
  async getAttendance(params?: { date?: string; status?: string; page?: number; limit?: number }) {
    const orgId = this.getOrgId();
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return this.requestRaw<{ data: any[]; total: number }>(`/attendance/${orgId}${qs ? '?' + qs : ''}`);
  }

  async createAttendance(data: { userId: number; deviceId: number; method: string; status?: string }) {
    const orgId = this.getOrgId();
    return this.request<any>('/attendance', {
      method: 'POST',
      body: JSON.stringify({ ...data, organizationId: orgId }),
    });
  }

  async deleteAttendance(id: number) {
    return this.request<any>(`/attendance/${id}`, { method: 'DELETE' });
  }

  async getAttendanceStats() {
    const orgId = this.getOrgId();
    return this.request<any>(`/attendance/stats/${orgId}`);
  }

  // Analytics
  async getAnalyticsHourly() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/analytics/hourly/${orgId}`);
  }

  async getAnalyticsWeekly() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/analytics/weekly/${orgId}`);
  }

  async getAnalyticsDeviceUsage() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/analytics/device-usage/${orgId}`);
  }

  async getAnalyticsMonthly() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/analytics/monthly/${orgId}`);
  }

  async getDashboardStats() {
    const orgId = this.getOrgId();
    return this.request<any>(`/dashboard/stats/${orgId}`);
  }

  async getRecentActivity() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/dashboard/recent/${orgId}`);
  }

  // Lookups
  async getClasses() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/lookups/classes?org_id=${orgId}`);
  }

  async createClass(name: string) {
    const orgId = this.getOrgId();
    return this.request<any>('/lookups/classes', { method: 'POST', body: JSON.stringify({ name, organizationId: orgId }) });
  }

  async getDepartments() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/lookups/departments?org_id=${orgId}`);
  }

  async createDepartment(name: string) {
    const orgId = this.getOrgId();
    return this.request<any>('/lookups/departments', { method: 'POST', body: JSON.stringify({ name, organizationId: orgId }) });
  }

  async getSections(classId: number) {
    return this.request<any[]>(`/lookups/sections/${classId}`);
  }

  async getEmployeeCategories() {
    const orgId = this.getOrgId();
    return this.request<any[]>(`/lookups/employee-categories?org_id=${orgId}`);
  }

  // Health
  async healthCheck() {
    return this.request<{ status: string; database: string }>('/health');
  }
}

export const api = new ApiClient();
