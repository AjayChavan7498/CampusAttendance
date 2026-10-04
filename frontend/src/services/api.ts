const defaultApiUrl = typeof window !== 'undefined' && import.meta.env.PROD
  ? `${window.location.origin}/api/v1`
  : 'http://localhost:8080/api/v1';

const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiUrl;


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('campuspulse_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If not on login page, can clear and trigger reload/redirect
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('campuspulse_token');
      localStorage.removeItem('campuspulse_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  // Handle binary responses like CSV downloads
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    if (!response.ok) {
      throw new ApiError('Failed to download CSV', response.status);
    }
    return (await response.blob()) as unknown as T;
  }

  let data: any;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `HTTP ${response.status}: Request failed`;
    throw new ApiError(errorMsg, response.status, data);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),

  downloadCsv: async (endpoint: string, defaultFilename: string) => {
    const token = localStorage.getItem('campuspulse_token');
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to export CSV (${res.status})`);
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};