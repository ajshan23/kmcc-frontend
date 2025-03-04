const authSessionKey = '_TECHMIN_AUTH_KEY_';

const fetchWithAuth = async (url, options = {}) => {
  const storedData = localStorage.getItem(authSessionKey);
  const session = storedData ? JSON.parse(storedData) : null;
  const token = session?.token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers, // Allow custom headers
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(authSessionKey);
    window.location.href = '/auth/login'; // Redirect to login if unauthorized
    throw new Error('Unauthorized');
  }

  return response.json();
};

export default fetchWithAuth;
