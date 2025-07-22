import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

if (typeof window !== 'undefined') {
    apiClient.interceptors.request.use(async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
    });
}

export default apiClient;
