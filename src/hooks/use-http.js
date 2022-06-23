import { useState, useCallback } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data, "DATA");
        let message = "Something went wrong!"
        if (data.message) {
          message = data.message
        }
        throw new Error(message);
      }

      setError(null);
      applyData(data);
    } catch (error) {
      console.log(error.message, "ERROR")
      setError(error.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  const removeError = () => {
    setError(false);
  }

  return {
    isLoading,
    error,
    sendRequest,
    removeError
  };
};

export default useHttp;
