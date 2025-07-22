import axios from 'axios';
import { auth } from '@/auth';   // your NextAuth helper

export async function apiServer() {
    const session = await auth();
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
    });
    if (session?.accessToken) {
        instance.defaults.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return instance;
}
