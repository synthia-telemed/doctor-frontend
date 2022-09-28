import { useEffect } from 'react'
import useSWR from 'swr'
import { apiFetcher } from '../api/axios'

const Dashboard = () => {
  const { appointments, error } = useSWR('/appointment/today', apiFetcher)
  // TODO: Handler error and display appointments
  return <div>Dashboard</div>
}

export default Dashboard
