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
      end_date: endTime === '' ? null : endTime,
      start_date: startTime === '' ? null : startTime
    }
    const res = await apiDefault.get('/appointment', { params: query })
    setListAppointment(res.data.appointments)
    setLoading(false)
  }
  const onChangeDateRangePicker = value => {
    setStartTime(value === null ? '' : value[0])
    setEndTime(value === null ? '' : value[1])
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
          <DateRangeTimePicker
            onChange={onChangeDateRangePicker}
            startTime={startTime}
            endTime={endTime}
          />
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
        <Panel />

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
            {loading ? (
              <div className="text-center h-[50vh] flex items-center justify-center">
                <div role="status">
                  <svg
                    class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : panel === 'COMPLETED' ? (
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
