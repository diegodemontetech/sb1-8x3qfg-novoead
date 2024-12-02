export const handleError = (error: any) => {
  // Log the error for debugging
  console.error('API Error:', error);

  // Don't treat empty results as errors
  if (error.code === 'PGRST116') {
    return [];
  }

  // For list endpoints, return empty array
  if (Array.isArray(error.data)) {
    return [];
  }

  throw new Error(error.message || 'An unexpected error occurred');
};

export const handleResponse = <T>(data: T | null): T | [] => {
  if (!data) {
    return Array.isArray(data) ? [] : data as T;
  }
  return data;
};

export const isSuccessResponse = (response: any) => {
  return response && !response.error && response.data !== undefined;
};