export interface LoginResponse {
  accessToken?: string;
  token?: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const loginApi = async (
  username: string,
  password: string
): Promise<{ token: string; username: string }> => {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please check credentials.');
  }

  const token = data.accessToken || data.token;
  if (!token) {
    throw new Error('No authentication token received from server.');
  }

  return {
    token,
    username: data.username || username,
  };
};
