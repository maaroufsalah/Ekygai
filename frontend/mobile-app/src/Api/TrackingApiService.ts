// TrackingApiService.ts

// Define interfaces for our data types
export interface Coordinate {
    latitude: number;
    longitude: number;
    timestamp?: number;
    altitude?: number | null;
    speed?: number | null;
    accuracy?: number | null;
  }
  
  export interface TrackingMetrics {
    totalDistance: number;
    currentSpeed: number;
    averageSpeed: number;
    calories: number;
    steps: number;
    duration: number;
    elevationGain: number;
  }
  
  export interface TrackingData {
    userId: string;
    timestamp: string;
    routeData: Coordinate[];
    metrics: TrackingMetrics;
    isFinalSync: boolean;
  }
  
  // Configuration for the API
  const API_CONFIG = {
    BASE_URL: 'https://your-dotnet-api.com/api', // Replace with your actual API URL
    ENDPOINTS: {
      TRACKING_DATA: '/fitness/trackingData',
      USER_STATS: '/user/stats',
    },
    TIMEOUT: 30000, // 30 seconds timeout
  };
  
  /**
   * Service to handle communication with the tracking API
   */
  class TrackingApiService {
    /**
     * Send tracking data to the API
     */
    public async sendTrackingData(
      userId: string,
      routeData: Coordinate[],
      metrics: TrackingMetrics,
      isFinalSync: boolean = false
    ): Promise<boolean> {
      // Prepare data payload
      const payload = {
        userId,
        timestamp: new Date().toISOString(),
        routeData,
        metrics,
        isFinalSync
      };
      
      try {
        const response = await this.apiRequest(
          `${API_CONFIG.ENDPOINTS.TRACKING_DATA}`,
          'POST',
          payload
        );
        
        return response !== null;
      } catch (error) {
        console.error('[TrackingApiService] Error sending tracking data:', error);
        return false;
      }
    }
  
    /**
     * Get user fitness statistics
     */
    public async getUserStats(userId: string): Promise<any | null> {
      try {
        return await this.apiRequest(
          `${API_CONFIG.ENDPOINTS.USER_STATS}/${userId}`,
          'GET'
        );
      } catch (error) {
        console.error('[TrackingApiService] Error fetching user stats:', error);
        return null;
      }
    }
  
    /**
     * Base API request method with error handling and timeout
     */
    private async apiRequest(
      endpoint: string, 
      method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
      data?: any
    ): Promise<any | null> {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      
      // Using Record<string, string> instead of HeadersInit
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${authToken}`,
      };
      
      const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      };
      
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT);
        });
        
        // Race the fetch against the timeout
        const response = await Promise.race([
          fetch(url, options),
          timeoutPromise
        ]) as Response;
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        
        return await response.text();
      } catch (error) {
        console.error(`[TrackingApiService] API request failed: ${url}`, error);
        return null;
      }
    }
  }
  
  // Export as singleton
  export const trackingApiService = new TrackingApiService();
  export default trackingApiService;