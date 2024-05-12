import { MEDIA_REQUEST } from '@/data/apiConstants';

import axios from '../axiosInstance/axios.instance';

export const uploadFileToStorage = async (file: File) => {
	try {
		return await axios.post(
			MEDIA_REQUEST,
			{ file: file },
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		);
	} catch (e) {
		console.error(e);
	}
};
