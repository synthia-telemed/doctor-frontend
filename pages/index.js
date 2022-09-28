import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { authApi } from '../api/axios'

export default function Login() {
  const { register, handleSubmit } = useForm({})
  const dispatch = useDispatch()
  const router = useRouter()

  const onSubmit = async data => {
    try {
      const { data: loginData } = await authApi.post('/signin', data)
      // TODO: Reset the values in the form
      localStorage.setItem('token', loginData.token)
      dispatch.token.setToken(loginData.token)
      router.push('/dashboard')
    } catch (error) {
      // TODO: Display error to the user
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('username', { required: true })}
          placeholder="username"
        ></input>
        <input
          {...register('password', { required: true })}
          placeholder="password"
          type="password"
        ></input>
        <input type="submit" />
      </form>
    </div>
  )
}
