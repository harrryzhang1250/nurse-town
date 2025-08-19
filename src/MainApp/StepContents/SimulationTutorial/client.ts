import { post } from 'aws-amplify/api';

interface DownloadUrlResponse {
  message: string;
  downloadUrl: string;
}

export class DownloadClient {
  /**
   * Get download URL for the specified operating system
   */
  async getDownloadUrl(os: 'windows' | 'mac'): Promise<DownloadUrlResponse> {
    try {
      // 真实API调用
      const restOperation = post({
        apiName: 'NurseTownAPI',
        path: 'download-url',
        options: {
          body: { os }
        }
      });

      const response = await restOperation.response;
      const data = await response.body.json();
      
      return data as unknown as DownloadUrlResponse;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  /**
   * Trigger download using the provided URL
   */
  triggerDownload(downloadUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Export a default instance
export const downloadClient = new DownloadClient();
