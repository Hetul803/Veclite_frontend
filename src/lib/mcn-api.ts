// MCN Backend API Client
// This connects to the MCN backend server

const MCN_API_URL = import.meta.env.VITE_MCN_API_URL || 'http://localhost:8000';

export interface VectorItem {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  metadata: Record<string, any>;
  score: number;
}

export interface MCNResponse<T> {
  status: string;
  data?: T;
  error?: string;
}

class MCNClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = MCN_API_URL) {
    this.baseUrl = baseUrl;
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  async addVectors(apiKey: string, vectors: VectorItem[]): Promise<{
    status: string;
    added: number;
    ram_usage_percent: number;
    total_vectors: number;
  }> {
    return this.request('/add', {
      method: 'POST',
      body: JSON.stringify({
        api_key: apiKey,
        vectors,
      }),
    });
  }
  
  async search(
    apiKey: string,
    vector: number[],
    k: number = 10
  ): Promise<{
    status: string;
    results: SearchResult[];
    count: number;
  }> {
    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify({
        api_key: apiKey,
        vector,
        k,
      }),
    });
  }
  
  async finalizeIndex(apiKey: string): Promise<{
    status: string;
    total_vectors: number;
    clusters: number;
  }> {
    // Note: Backend doesn't require api_key for finalize, but we'll include it for consistency
    return this.request('/finalize', {
      method: 'POST',
      body: JSON.stringify({
        api_key: apiKey,
      }),
    });
  }
  
  async healthCheck(): Promise<{
    status: string;
    ram_usage: string;
    hot_buffer_size?: number;
    cold_index_size?: number;
    total_vectors?: number;
  }> {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export const mcnClient = new MCNClient();

