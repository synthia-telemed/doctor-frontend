export const token = {
  state: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  },
  reducers: {
    setToken(state, payload) {
      return {
        ...state,
        token: payload
      }
    }
  }
}
