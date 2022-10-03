import { useEffect } from 'react'
import router from 'next/router'
import { useDispatch } from 'react-redux'

const Dashboard = () => {
  const dispatch = useDispatch()

  const onLogout = () => {
    dispatch.user.removeToken()
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
