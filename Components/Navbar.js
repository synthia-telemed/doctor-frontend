import router from 'next/router'
import { useState, useEffect } from 'react'
import IconSynthia from './Assets/IconSynthia'
const Navbar = () => {
  const [pathname, setPathName] = useState('/dashbord')
  useEffect(() => {
    setPathName(window.location.pathname)
  }, [])
  const ButtonNavbar = ({ text, textStyle, bgStyle, icon, path, colorIcon }) => {
    return (
      <div className="cursor-pointer" onClick={() => router.push(path)}>
        <div
          className={`flex flex-col justify-center items-center w-[131px] h-[40px] ${bgStyle} rounded-[8px]`}
        >
          <h1 className={`typographyTextMdMedium ${textStyle} `}>{text}</h1>
        </div>
      </div>
    )
  }
  const onClickLogout = () =>{
    localStorage.removeItem("token")
    router.push("/");
  }
  const componentNav = [
    {
      label: 'Appointment',
      link: '/dashboard',
      page: 'Appointment',
      detail: '/patient-detail'
    }
  ]
  return (
    <div className="flex px-[32px] justify-between items-center border-b-[1px] border-solid border-gray-200 py-[32px] w-screen fixed bg-base-white z-[1000] top-0">
      <div className="flex items-center">
        {/* <img src={IconSynthia} alt="Default Image" className="mr-[16px]" /> */}

        <IconSynthia />
        <div className="flex justify-between w-[234px] ml-[32px] ">
          {componentNav.map(item => {
            return (
              <ButtonNavbar
                text={item.label}
                key={item.page}
                path={item.link}
                textStyle={item.link === pathname ? 'text-primary-500' : 'text-gray-500'}
                bgStyle={item.link === pathname ? 'bg-primary-50' : 'bg-base-white'}
              />
            )
          })}
        </div>
      </div>
      <div className="w-[119px] cursor-pointer h-[40px] border-[1px] border-solid border-gray-300 flex justify-center items-center rounded-[8px]" onClick={onClickLogout}>
        <h1 className="typographyTextSmMedium">Logout</h1>
      </div>
    </div>
  )
}
export default Navbar
