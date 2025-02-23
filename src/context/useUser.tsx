import { useRouter } from 'next/router';
import {
	createContext,
	FC,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react';
import { io, Socket } from 'socket.io-client';

import CenteredLoader from '@/components/custom/CenteredLoader';
import { Navbar } from '@/components/navbar/Navbar';
import { HOST_ADDRESS } from '@/data/apiConstants';
import { AuthResponse } from '@/data/dto/auth/auth.response';

import { getUser } from '../api/auth.api';
import { UserResponse } from '../data/dto/user/userInfo';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../data/localStorageKeys';

type Properties = {
	children: ReactNode;
};

interface Context {
	user: UserResponse | null;
	getUserData: () => Promise<UserResponse | undefined>;
	setJwtTokens: (jwtData: AuthResponse) => void;
	logout: () => void;
	socket: Socket | null;
}

const UserContext = createContext<Context | null>(null);

const useUser = () => useContext(UserContext) as Context;

export const UserContextProvider: FC<Properties> = ({ children }) => {
	const [userData, setUserData] = useState<UserResponse | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const getUserData = useCallback(async () => {
		const response: any = await getUser();
		if (response && response.data && response.status === 200) {
			setUserData(response.data);
		}
		setIsLoading(false);
		return (response?.data as UserResponse) || null;
	}, []);

	const setJwtTokens = useCallback(
		(jwtData: AuthResponse) => {
			if (jwtData) {
				localStorage.setItem(ACCESS_TOKEN, jwtData.accessToken);
				localStorage.setItem(REFRESH_TOKEN, jwtData.refreshToken);
				getUserData();
			} else {
				localStorage.removeItem(ACCESS_TOKEN);
				localStorage.removeItem(REFRESH_TOKEN);
			}
		},
		[getUserData]
	);

	const logout = useCallback(() => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);
		router.push('/');
		setUserData(null);
	}, [router]);

	// useEffect(() => {
	//   if (!user) {
	//     const link = window.location.pathname;
	//     if (link !== '/' && link) {
	//       localStorage.setItem('next-link', link + window.location.search);
	//     }
	//   }

	//   if (!user) return;

	//   localStorage.removeItem('next-link');
	// }, [user]);

	useEffect(() => {
		const socket = io(HOST_ADDRESS + '/chat', {
			transports: ['websocket', 'polling'],
			withCredentials: true,
			autoConnect: true,
			auth: {
				token: localStorage.getItem(ACCESS_TOKEN)
			}
		});
		setSocket(socket);
	}, [userData]);

	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			getUserData();
		} else {
			setIsLoading(false);
		}
	}, [getUserData]);

	const providerValue = useMemo(
		() => ({
			user: userData,
			getUserData,
			setJwtTokens,
			logout,
			socket
		}),
		[userData, getUserData, setJwtTokens, socket, logout]
	);

	return isLoading ? (
		<div className="flex h-full items-center justify-center">
			<CenteredLoader />
		</div>
	) : (
		<UserContext.Provider value={providerValue}>
			<Navbar />
			{children}
		</UserContext.Provider>
	);
};

export default useUser;
