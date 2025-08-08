// src/services/api.ts
const API_BASE_URL = 'http://localhost:5002'; // Or your public ngrok backend URL

interface RequestOptions extends RequestInit {
  // Add any custom options if needed
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem('jwtToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    } else {
      return {} as T;
    }
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

export const authApi = {
  login: (credentials: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

export const dashboardApi = {
  getStats: () => apiFetch('/dashboard/stats'),
  getReasonsAnalysis: () => apiFetch('/dashboard/reasons/analysis'),
};

export const portApi = {
  getPortIn: () => apiFetch('/port-in'),
  getPortOut: () => apiFetch('/port-out'),
  // Add this line to fix the error
  submitPortIn: (portInData: any) => apiFetch('/port-in', { method: 'POST', body: JSON.stringify(portInData) }),
};

export const snapbackApi = {
  getSnapback: () => apiFetch('/snapback'),
};

export const complaintApi = {
  submitComplaint: (complaintData: any) => apiFetch('/complaints', { method: 'POST', body: JSON.stringify(complaintData) }),
  getComplaints: () => apiFetch('/complaints'),
  updateComplaintStatus: (id: string, status: string) => apiFetch(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

export const subscriberApi = {
  getSubscribers: () => apiFetch('/subscribers', { method: 'POST' }),
  createSubscriber: (subscriberData: any) => apiFetch('/subscribers/create', { method: 'POST', body: JSON.stringify(subscriberData) }),
};

export const exportApi = {
  exportPortIn: () => apiFetch('/export/port-in'),
  exportPortOut: () => apiFetch('/export/port-out'),
  exportSnapback: () => apiFetch('/export/snapback'),
};