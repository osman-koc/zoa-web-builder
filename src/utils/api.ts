export const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  } else {
    return 'https://zoa-api.osmankoc.dev';
  }
};

export const getBaseSocketUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'ws://localhost:3000';
  } else {
    return 'wss://zoa-api.osmankoc.dev';
  }
};

export const getCsrfToken = async (): Promise<string> => {
  try {
    const csrfTokenFromCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (csrfTokenFromCookie) {
      return csrfTokenFromCookie;
    }

    const response = await fetch(`${getBaseUrl()}/api/csrf-token`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token.');
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw new Error('Unable to retrieve CSRF token.');
  }
};

export interface WebSocketMessage {
  type: 'chunk' | 'complete' | 'error';
  content?: string;
  message?: string;
  html?: string;
  completed?: boolean;
}

export const generateWebsite = async (prompt: string, csrfToken: string): Promise<void> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000 * 5);

  try {
    const response = await fetch(`${getBaseUrl()}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate website');
    }

    return response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};