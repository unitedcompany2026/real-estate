const TOKEN_KEY = 'access_token'

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
