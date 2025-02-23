import { isAxiosError } from 'axios';

import { CONTACTS_REQUEST } from '@/data/apiConstants';
import { IContactsResponse } from '@/data/dto/contacts/contactsResponse';

import axiosInstance from './axios.instance';

export const getContacts = async () => {
	try {
		return await axiosInstance.get<IContactsResponse[]>(`${CONTACTS_REQUEST}`);
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e.response;
		}
	}
};
