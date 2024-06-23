// frontend/app/api/posts/tsx
// API FUNCTIONS

import axios from 'axios';

const api = axios.create({
    baseURL: 'https://8819-2607-f140-400-2d-419d-296f-b83-9711.ngrok-free.app',
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
})


export async function getPosts() {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export async function addPost(content: string, title: string) {
    try {
        const response = await api.post('/posts', { content, title });
        return response.data;
    } catch (error) {
        console.error('Error adding post:', error);
    }
}

export async function getReplies(postId: number) {
    try {
        const response = await api.get(`/posts/${postId}/reply`);
        return response.data;
    } catch (error) {
        console.error('Error fetching replies:', error);
    }
}

export async function addReply(postId: number, content: string, parentReplyId?: number, user?:string) {
    try {
        const commentor = user ? user : 'matthewkao';
        const response = await api.post(`/posts/${postId}/reply`, { content, parentReplyId, user: commentor });
        return response.data;
    } catch (error) {
        console.error('Error adding reply:', error);
    }
}
