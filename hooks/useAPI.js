import axios from 'axios'
import { useSelector } from 'react-redux'

const useAPI = () => {
  const { token } = useSelector(state => state.user)
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/doctor/api`,
    withCredentials: false
  })
  if (token) {
    instance.defaults.headers.Authorization = `Bearer ${token}`
  }
  return [instance]
}

export default useAPI
