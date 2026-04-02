const TOKEN_KEY = 'token'
const USERNAME_KEY = 'username'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)
export const getUsername = () => localStorage.getItem(USERNAME_KEY)
export const setUsername = (username) => localStorage.setItem(USERNAME_KEY, username)
export const removeUsername = () => localStorage.removeItem(USERNAME_KEY)

export const isAuthenticated = () => !!getToken()
