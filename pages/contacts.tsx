import { useEffect, useState } from 'react';

import { getContacts } from '@/api/contacts';
import { IContactsResponse } from '@/data/dto/contacts/contactsResponse';

export default function Contacts() {
	const [contacts, setContacts] = useState<IContactsResponse[]>([]);

	useEffect(() => {
		getContacts().then(response => {
			if (response?.data) {
				setContacts(response.data);
			}
		});
	}, []);

	return (
		<div className="flex flex-col p-6">
			<p className="text-2xl font-bold mb-2">
				Контакти безкоштовної психологічної допомоги
			</p>
			<div className="flex flex-col gap-4">
				{contacts.map(contact => (
					<div key={contact.id}>
						<p className="text-lg font-bold">{contact.name}</p>
						<p className="text-sm">{contact.phone}</p>
						<p className="text-sm">{contact.workingHours}</p>
					</div>
				))}
			</div>
		</div>
	);
}
