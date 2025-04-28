import { getItem, removeItem, setItem } from '@/lib/storage';
import { Env } from '@env';

const TOKEN = `${Env.PACKAGE}_token`;

export type TokenType = {
  access: string;
  refresh: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);