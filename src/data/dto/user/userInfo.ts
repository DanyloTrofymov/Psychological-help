export interface UserResponse {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	active: boolean;
	avatarId: number;
	avatar: MediaResponse;
	role: RoleResponse;
}
export interface RoleResponse {
	id: number;
	name: string;
	key: ROLE;
}

export enum ROLE {
	USER = 'USER',
	ADMIN = 'ADMIN',
	THERAPIST = 'THERAPIST'
}
export interface MediaResponse {
	id: number;
	url: string;
	createdAt: Date;
	updatedAt: Date;
	type: string;
}
