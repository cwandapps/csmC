const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('csms_token');
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

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data as T;
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string; organizationName: string; organizationType: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
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

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: number) {
    return this.request<any>(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request<any>('/users', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateUser(id: number, data: any) {
    return this.request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, { method: 'DELETE' });
  }

  // Devices
  async getDevices() {
    return this.request<any[]>('/devices');
  }

  async createDevice(data: any) {
    return this.request<any>('/devices', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateDevice(id: number, data: any) {
    return this.request<any>(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteDevice(id: number) {
    return this.request<any>(`/devices/${id}`, { method: 'DELETE' });
  }

  // Attendance
  async getAttendance(params?: { date?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return this.request<{ data: any[]; total: number; page: number; limit: number }>(`/attendance?${query}`);
  }

  async createAttendance(data: { userId: number; deviceId: number; method: string; status?: string }) {
    return this.request<any>('/attendance', { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteAttendance(id: number) {
    return this.request<any>(`/attendance/${id}`, { method: 'DELETE' });
  }

  async getAttendanceStats() {
    return this.request<any>('/attendance/stats');
  }

  // Lookups
  async getClasses() {
    return this.request<any[]>('/lookups/classes');
  }

  async createClass(name: string) {
    return this.request<any>('/lookups/classes', { method: 'POST', body: JSON.stringify({ name }) });
  }

  async getDepartments() {
    return this.request<any[]>('/lookups/departments');
  }

  async createDepartment(name: string) {
    return this.request<any>('/lookups/departments', { method: 'POST', body: JSON.stringify({ name }) });
  }

  async getSections(classId: number) {
    return this.request<any[]>(`/lookups/sections/${classId}`);
  }

  async getEmployeeCategories() {
    return this.request<any[]>('/lookups/employee-categories');
  }

  // Health
  async healthCheck() {
    return this.request<{ status: string; database: string }>('/health');
  }
}

export const api = new ApiClient();
