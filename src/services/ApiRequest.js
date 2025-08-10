const apiRequest = async (baseUrl, path, options = {}) => {
  try {
    const response = await fetch(`${baseUrl}${path}`, options);
    if (!response.ok) {
      // Try to parse error response from the server for more detail
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`API request failed for path: ${path}`, error);
    throw error;
  }
};
