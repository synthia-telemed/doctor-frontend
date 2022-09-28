import Axios from 'axios'

const baseURL = `${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/doctor/api`

let token = ''
if (typeof window !== 'undefined') {
  token = localStorage.getItem('token')
}

export const api = Axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const apiFetcher = url => api.get(url).then(res => res.data)

export const authApi = Axios.create({
  baseURL: `${baseURL}/auth`
})
