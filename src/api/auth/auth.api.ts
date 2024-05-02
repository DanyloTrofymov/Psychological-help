import { AuthResponse } from "@/dto/auth/auth.response";
import axiosInstance from "../axiosInstance/axios.instance";
import axios from 'axios';
import { AuthRequest } from "@/dto/auth/auth.request";
import { AUTH_REQUEST } from "@/data/apiConstants";

export const signIn = async (data: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${AUTH_REQUEST}/signIn`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTokens = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${AUTH_REQUEST}/refresh-token`, { headers: { Authorization: `Bearer ${refreshToken}` } });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const getUser = async () => {
  try {
    return await axiosInstance.get(`${AUTH_REQUEST}/current-user`);
  } catch (error) {
    throw error;
  }
}