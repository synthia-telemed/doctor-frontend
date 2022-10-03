export const user = {
  state: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  },
  reducers: {
    setToken(state, payload) {
      return {
        ...state,
        token: payload
      }
    },
    removeToken(state, payload) {
      return {
        ...state,
        token: ''
      }
    }
  }
}
