import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import useAPI from '../hooks/useAPI'

export default function Login() {
  const { register, handleSubmit } = useForm({})
  const dispatch = useDispatch()
  const router = useRouter()
  const [api] = useAPI()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch.user.setToken(token)
      router.push('/dashboard')
    }
  }, [])

  const onSubmit = async data => {
    try {
      const { data: loginData } = await api.post('/auth/signin', data)
      // TODO: Reset the values in the form
      localStorage.setItem('token', loginData.token)
      dispatch.user.setToken(loginData.token)
      router.push('/dashboard')
    } catch (error) {
      // TODO: Display error to the user
    }
  }
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <h1 className="typographyHeadingMdMedium text-base-black">Login to your account</h1>
      <h1 className="typographyTextMdMedium text-gray-600">
        Welcome back! Please enter your details.
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mt-[34px] items-center">
          <div className="w-[360px] h-[70px]">
            <h1 className="typographyTextMdMedium text-gray-700">Username</h1>
            <input
              className="border-[1px] border-solid border-gray-300 px-[10px] py-[14px] rounded-[8px] w-full"
              {...register('username', { required: true })}
              placeholder="username"
            ></input>
          </div>
          <div className="mt-[34px] w-[360px] h-[70px]">
            <h1 className="typographyTextMdMedium text-gray-700">Password</h1>
            <input
              className="border-[1px] border-solid border-gray-300 px-[10px] py-[14px] rounded-[8px] w-full"
              {...register('password', { required: true })}
              placeholder="password"
              type="password"
            ></input>
          </div>

          <button
            type="submit"
            className="mt-[34px] w-[360px] h-[48px] px-[10px] py-[18px] rounded-[8px] bg-primary-500 flex justify-center items-center text-base-white"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
