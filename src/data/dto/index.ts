export type PaginatedResponse<T> = {
	content: T[];
	page: number;
	limit: number;
	totalElements: number;
	totalPages: number;
};
