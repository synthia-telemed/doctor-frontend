import { useState, useEffect } from 'react'
import router from 'next/router'
import { useDispatch } from 'react-redux'
import Navbar from '../Components/Navbar'
import useAPI from '../hooks/useAPI'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import DateRangeTimePicker from '../Components/DateRangeTimePicker'

const Dashboard = () => {
  dayjs.extend(utc)
  const [panel, setPanel] = useState('SCHEDULED')
  const [listAppointment, setListAppointment] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [apiDefault] = useAPI()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [renderFirstTime, setRenderFirstTime] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    getListAppointment()
    setRenderFirstTime(true)
  }, [])

  useEffect(() => {
    getListAppointment()
  }, [panel, search, startTime, endTime])

  const getListAppointment = async () => {
    setLoading(true)
    const query = {
      status: panel,
      page_number: 1,
      per_page: 100,
      text: search ? search : null,
      end_date_time: endTime === '' ? null : endTime,
      start_date_time: startTime === '' ? null : startTime
    }
    const res = await apiDefault.get('/appointment', { params: query })
    console.log(res)
    setListAppointment(res.data.appointments)
    setLoading(false)
  }
  const onChangeDateRangePicker = value => {
    setStartTime(value[0])
    setEndTime(value[1])
  }

  const ButtonPanel = ({ text, style }) => {
    return (
      <div
        className={`cursor-pointer w-[109px] h-[36px] text-center ${
          panel === text ? 'bg-gray-50 text-base-black' : 'bg-base-white text-gray-500'
        } ${style}`}
        onClick={() => setPanel(text)}
      >
        <h1 className="flex items-center w-full h-full justify-center typographyTextSmSemibold ">
          {text}
        </h1>
      </div>
    )
  }
  const CardAppointment = ({ data }) => {
    return (
      <div
        onClick={() =>
          router.push(
            {
              pathname: '/patient-detail',
              query: { appointmentID: data.id }
            },
            '/patient-detail',
            { shallow: false }
          )
        }
        className="cursor-pointer w-full px-[24px] py-[16px] flex border-b-[1px] border-solid border-gray-200"
      >
        <div className="max-w-[176px] w-full flex items-center">
          <img
            src="/image/Ellipse 3.png"
            alt=""
            width="32px"
            height="32px"
            className="mr-[8px]"
          />
          <h1 className="typographyTextSmMedium text-base-black">
            {data.patient.full_name}
          </h1>
        </div>
        <div className="max-w-[137px] w-full flex items-center">
          <h1 className="typographyTextSmMedium text-base-black">{data.patient.id}</h1>
        </div>
        <div className="max-w-[170px] w-full flex items-center">
          <h1 className="typographyTextSmMedium text-base-black">
            {dayjs(data.end_date_time).format('DD MMMM YYYY')}
          </h1>
        </div>
        <div className="max-w-[176px] w-full flex items-center">
          <h1 className="typographyTextSmMedium text-base-black">
            {' '}
            {dayjs(data.end_date_time).utcOffset(7).format('dddd HH:mm A')}
          </h1>
        </div>
        <div className="max-w-full w-full flex items-center">
          <h1 className="typographyTextSmMedium text-base-black"> {data?.detail}</h1>
        </div>
      </div>
    )
  }
  const Panel = () => {
    return (
      <div className="flex w-full justify-between items-center mt-[16px] px-[16px]">
        <div className="flex">
          <ButtonPanel
            text="SCHEDULED"
            style="border-b-[1px] border-l-[1px] border-t-[1px] border-solid border-gray-300 rounded-bl-[6px] rounded-tl-[6px]"
          />
          <ButtonPanel
            text="COMPLETED"
            style="border-[1px] border-solid border-gray-300"
          />
          <ButtonPanel
            text="CANCELLED"
            style="border-b-[1px] border-r-[1px] border-t-[1px] border-solid border-gray-300 rounded-br-[6px] rounded-tr-[6px]"
          />
        </div>
        <div className="flex">
          <div className="flex pl-[20px] relative">
            <img
              src="/image/search-lg.svg"
              alt=""
              className="absolute top-[50%] translate-y-[-50%] pl-[10px]"
            />
            <input
              key="search"
              onChange={e => setSearch(e.target.value)}
              value={search}
              className="pl-[40px] w-[400px] h-[44px] flex items-center border-[1px] border-solid border-gray-300 rounded-[8px] mr-[24px]"
              placeholder="Search"
              autoFocus
            />
          </div>
          <DateRangeTimePicker onChange={onChangeDateRangePicker} />
        </div>
      </div>
    )
  }

  const onLogout = () => {
    dispatch.user.removeToken()
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div>
      <Navbar />
      <div className="border-[1px] border-solid border-gray-200 h-full rounded-[8px] mt-[39px] mx-[112px] ">
        <h1 className="pl-[16px] typographyHeadingSmSemibold mt-[55px] text-base-black">
          Appointment
        </h1>
        {renderFirstTime ? <Panel /> : <></>}

        <div className="flex flex-col items-center mt-[11px] w-full">
          <div className="flex typographyHeadingXsMedium w-full pl-[16px] bg-gray-50 px-[24px] py-[12px] border-[1px] rounded-tl-[8px] rounded-tr-[8px] border-solid border-gray-200">
            <h1 className="typographyTextXsMedium text-gray-500 w-[176px] ">
              Patient Name
            </h1>
            <h1 className="typographyTextXsMedium text-gray-500 w-[137px] ">
              Patient Number
            </h1>
            <h1 className="typographyTextXsMedium text-gray-500 w-[170px] ">Date</h1>
            <h1 className="typographyTextXsMedium text-gray-500 w-[176px] ">Time</h1>
            <h1 className="typographyTextXsMedium text-gray-500 w-[344px] ">Note</h1>
          </div>
          <div>
            {panel === 'COMPLETED' ? (
              <>
                {listAppointment?.map(data => {
                  return (
                    <>
                      <CardAppointment key={data.id} data={data} />
                    </>
                  )
                })}
              </>
            ) : panel === 'CANCELLED' ? (
              <>
                {listAppointment?.map(data => {
                  return (
                    <>
                      <CardAppointment key={data.id} data={data} />
                    </>
                  )
                })}
              </>
            ) : panel === 'SCHEDULED' ? (
              <>
                {' '}
                {listAppointment?.map(data => {
                  return (
                    <>
                      <CardAppointment key={data.id} data={data} />
                    </>
                  )
                })}
              </>
            ) : (
              <>Error 404</>
            )}
          </div>
        </div>
      </div>

      {/* <button onClick={onLogout}>Logout</button> */}
    </div>
  )
}

export default Dashboard
