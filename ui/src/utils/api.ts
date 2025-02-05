/**
 * CSRF Token'ı API'den alır.
 */
export const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3000/api/csrf-token", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch CSRF token.");
    }

    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw new Error("Unable to retrieve CSRF token.");
  }
};

/**
 * Website generator API çağrısı yapar.
 */
export const generateWebsite = async (prompt: string, csrfToken: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.message || "Failed to generate website");
    }

    const data = await response.json();
    if (!data.code) {
      throw new Error("Invalid code received from API");
    }

    return data.code;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
};
