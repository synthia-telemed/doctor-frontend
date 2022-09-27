import { useForm } from 'react-hook-form'
import { authApi } from '../api/axios'

export default function Login() {
  const { register, handleSubmit, reset } = useForm({})

  const onSubmit = async data => {
    try {
      const { data: loginData } = await authApi.post('/signin', data)
      // TODO: Reset the values in the form
      localStorage.setItem('token', loginData.token)
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
