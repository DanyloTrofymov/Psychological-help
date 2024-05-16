import { UserResponse } from '../user/userInfo';

export interface ChatroomResponse {
	id: number;
	title: string;
	createdAt: Date;
	updatedAt: Date;
	active: boolean;
	withAI: boolean;
	ChatroomParticipants: ChatroomParticipants[];
}

export interface MessageResponse {
	id: number;
	message: string;
	createdAt: Date;
	updatedAt: Date;
	aiThreadId: string;
	chatroomId: number;
	userId: number;
	user: UserResponse;
}

export interface Message {
	id?: number;
	message: string;
	createdAt?: Date;
	updatedAt?: Date;
	aiThreadId?: string;
	chatroomId?: number;
	userId?: number;
	user?: UserResponse;
}

export interface ChatroomParticipants {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	aiThreadId: string;
	chatroomId: number;
	userId: number;
}
[];
