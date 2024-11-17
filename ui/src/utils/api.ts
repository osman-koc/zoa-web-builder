/**
 * Interface for the API response
 */
interface GenerateWebsiteResponse {
    code: string;
    error?: {
      error: string;
      details: string;
    };
  }
  
  /**
   * Generates a website based on the provided prompt using the Web Generator API
   * @param prompt Description of the website to generate
   * @returns Promise containing the generated HTML code
   * @throws Error if the API request fails
   */
  export const generateWebsite = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to generate website');
      }
  
      const data = await response.json() as GenerateWebsiteResponse;
      
      if (data.error) {
        throw new Error(data.error.details || data.error.error);
      }
  
      return data.code;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };