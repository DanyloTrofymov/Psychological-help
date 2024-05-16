import { CHAT_REQUEST } from '@/data/apiConstants';

import axios from './axios.instance';

export const getAiChats = async (page: number = 0, pageSize: number = 20) => {
	try {
		return await axios.get(`${CHAT_REQUEST}/aiChats`, {
			params: { page, pageSize }
		});
	} catch (error) {
		console.error(`Error fetching AI chats:`, error);
		throw error;
	}
};

export const getUsersChats = async (
	page: number = 0,
	pageSize: number = 20
) => {
	try {
		return await axios.get(`${CHAT_REQUEST}/usersChats`, {
			params: { page, pageSize }
		});
	} catch (error) {
		console.error(`Error fetching user chats:`, error);
		throw error;
	}
};

export const getWithoutTherapis = async (
	page: number = 0,
	pageSize: number = 20
) => {
	try {
		return await axios.get(`${CHAT_REQUEST}/withoutTherapis`, {
			params: { page, pageSize }
		});
	} catch (error) {
		console.error(`Error fetching chatrooms without therapist:`, error);
		throw error;
	}
};

export const getAllChats = async (page: number = 0, pageSize: number = 20) => {
	try {
		return await axios.get(`${CHAT_REQUEST}`, {
			params: { page, pageSize }
		});
	} catch (error) {
		console.error(`Error fetching chatrooms:`, error);
		throw error;
	}
};

export const pingAdmin = async (chatroomId: number) => {
	try {
		return await axios.post(`${CHAT_REQUEST}/pingAdmin`, { chatroomId });
	} catch (error) {
		console.error(`Error pinging admin:`, error);
		throw error;
	}
};

export const getMessages = async (
	chatroomId: number,
	page: number = 0,
	pageSize: number = 10
) => {
	try {
		return await axios.get(`${CHAT_REQUEST}/messages`, {
			params: { chatroomId, page, pageSize }
		});
	} catch (error) {
		console.error(`Error fetching messages:`, error);
		throw error;
	}
};

export const renameChatroom = async (id: number, title: string) => {
	try {
		return await axios.put(`${CHAT_REQUEST}/${id}`, { title });
	} catch (error) {
		console.error(`Error renaming chatroom:`, error);
		throw error;
	}
};

export const deleteChatroom = async (id: number) => {
	try {
		return await axios.delete(`${CHAT_REQUEST}/${id}`);
	} catch (error) {
		console.error(`Error deleting chatroom:`, error);
		throw error;
	}
};

export const sentTakeToAI = async (takeId: number) => {
	try {
		return await axios.post(`${CHAT_REQUEST}/sendTakeToAi/${takeId}`);
	} catch (error) {
		console.error(`Error deleting chatroom:`, error);
		throw error;
	}
};

export const sentTakeToTherapist = async (takeId: number) => {
	try {
		return await axios.post(`${CHAT_REQUEST}/sendTakeToTherapist/${takeId}`);
	} catch (error) {
		console.error(`Error deleting chatroom:`, error);
		throw error;
	}
};

export const joinChatroom = async (chatroomId: number) => {
	try {
		return await axios.post(`${CHAT_REQUEST}/joinRoom`, { chatroomId });
	} catch (error) {
		console.error(`Error joining chatroom:`, error);
		throw error;
	}
};
