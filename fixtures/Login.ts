import axios from 'axios';

interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const apiUrl = process.env.API_URL || 'https://example.com/api'; // Use environment variable for API URL

    try {
        const response = await axios.post<LoginResponse>(`${apiUrl}/login`, {
            username,
            password,
        });

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Login failed with Axios error:', error.response?.data || error.message);
        } else {
            console.error('Login failed with unexpected error:', error);
        }
        throw new Error('Unable to login. Please check your credentials.');
    }
};