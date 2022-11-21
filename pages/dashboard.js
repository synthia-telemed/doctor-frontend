import { useState, useEffect } from 'react'
import router from 'next/router'
import { useDispatch } from 'react-redux'
import Navbar from '../Components/Navbar'
import useAPI from '../hooks/useAPI'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ButtonPanel from '../Components/ButtonPanel'
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
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPage, setTotaPage] = useState(1)
  const dispatch = useDispatch()

  useEffect(() => {
    getListAppointment()
  }, [])

  useEffect(() => {
    getListAppointment()
  }, [panel, search, startTime, endTime, pageNumber])

  const getListAppointment = async () => {
    setLoading(true)
    const query = {
      status: panel,
      page_number: pageNumber,
      per_page: 10,
      text: search ? search : null,
      end_date: endTime === '' ? null : endTime,
      start_date: startTime === '' ? null : startTime
    }
    const res = await apiDefault.get('/appointment', { params: query })
    setListAppointment(res.data.appointments)
    setTotaPage(res.data.total_page)
    setLoading(false)
  }
  const onChangeDateRangePicker = value => {
    setStartTime(value === null ? '' : value[0])
    setEndTime(value === null ? '' : value[1])
  }
  const nextPage = () => {
    if (pageNumber !== totalPage) {
      setPageNumber(pageNumber + 1)
    }
  }
  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const CardAppointment = ({ data }) => {
    return (
      <div
        className="cursor-pointer"
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
      >
        <div className="grid grid-cols-6 gap-4 w-full px-[24px] py-[16px] border-b-[1px] border-solid border-gray-200 items-center">
          <div className="flex w-full items-center">
            <img
              src={data.patient.profile_pic_url}
              alt=""
              width="32px"
              height="32px"
              className="mr-[8px] object-contain rounded-[16px]"
            />
            <h1 className="typographyTextSmMedium text-base-black">
              {data.patient.full_name}
            </h1>
          </div>
          <div className="">
            <h1 className="typographyTextSmMedium text-base-black">{data.patient.id}</h1>
          </div>
          <div className="">
            <h1 className="typographyTextSmMedium text-base-black">
              {dayjs(data.end_date_time).format('DD MMMM YYYY')}
            </h1>
          </div>
          <div className="">
            <h1 className="typographyTextSmMedium text-base-black">
              {' '}
              {dayjs(data.end_date_time).utcOffset(7).format('HH:mm A')}
            </h1>
          </div>
          <div className="col-span-2">
            <h1 className="typographyTextSmRegular text-gray-500"> {data?.detail}</h1>
          </div>
        </div>
      </div>
    )
  }
  const Panel = () => {
    return (
      <div className="flex w-full justify-between items-center mt-[16px] px-[16px] ">
        <div className="flex">
          <ButtonPanel
            text="Upcoming"
            value="SCHEDULED"
            panel={panel}
            onClick={() => setPanel('SCHEDULED')}
            style="border-b-[1px] border-l-[1px] border-t-[1px] border-solid border-gray-300 rounded-bl-[6px] rounded-tl-[6px]"
          />
          <ButtonPanel
            text="Completed"
            value="COMPLETED"
            panel={panel}
            onClick={() => setPanel('COMPLETED')}
            style="border-[1px] border-solid border-gray-300"
          />
          <ButtonPanel
            text="Cancelled"
            value="CANCELLED"
            panel={panel}
            onClick={() => setPanel('CANCELLED')}
            style="border-b-[1px] border-r-[1px] border-t-[1px] border-solid border-gray-300 rounded-br-[6px] rounded-tr-[6px]"
          />
        </div>
        <div className="flex">
          <div className="flex items-center pl-[20px] relative">
            <img
              src="/image/search-lg.svg"
              alt=""
              className="absolute top-[50%] translate-y-[-50%] pl-[10px]"
            />
            <input
              key="search"
              onChange={e => setSearch(e.target.value)}
              value={search}
              className="pl-[14px] w-[400px] h-[34px] typographyTextMdRegular flex items-center border-[1px] border-solid border-gray-300 rounded-[8px] mr-[24px] z-0 focus:outline-none focus:border-primary-300 focus:ring-primary-300 focus:ring-0.5 focus:shadow-xs-primary-100"
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

  console.log(listAppointment)

  return (
    <div className="mt-[150px]">
      <Navbar />
      <div className="border-[1px] border-solid border-gray-200 h-full rounded-[16px] mx-[112px] mb-[100px]">
        <h1 className="pl-[16px] mt-[16px] typographyHeadingSmSemibold  text-base-black">
          Appointment
        </h1>
        <Panel />

        <div className="flex flex-col items-center mt-[11px] w-full ">
          <div className="grid grid-cols-6 gap-4 w-full px-[24px] py-[12px] bg-gray-50 rounded-tl-[8px] rounded-tr-[8px] border-solid border-gray-200 border-[1px] ">
            <h1 className="typographyTextXsMedium text-gray-500 w-full  ">
              Patient name
            </h1>
            <h1 className="typographyTextXsMedium text-gray-500  ">Patient number</h1>
            <h1 className="typographyTextXsMedium text-gray-500 ">Date</h1>
            <h1 className="typographyTextXsMedium text-gray-500 ">Time</h1>
            <h1 className="typographyTextXsMedium text-gray-500 col-span-2">Detail</h1>
          </div>
          <div>
            {loading ? (
              <div className="text-center h-[50vh] flex items-center justify-center">
                <div role="status">
                  <svg
                    className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
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
                {listAppointment.length ? (
                  listAppointment?.map(data => {
                    return (
                      <>
                        <CardAppointment key={data.id} data={data} />
                      </>
                    )
                  })
                ) : (
                  <div className="h-[50vh] flex items-center justify-center">
                    Not found
                  </div>
                )}
              </>
            ) : panel === 'CANCELLED' ? (
              <>
                {listAppointment.length ? (
                  listAppointment?.map(data => {
                    return (
                      <>
                        <CardAppointment key={data.id} data={data} />
                      </>
                    )
                  })
                ) : (
                  <div className="h-[50vh] flex items-center justify-center">
                    Not found
                  </div>
                )}
              </>
            ) : panel === 'SCHEDULED' ? (
              <>
                {' '}
                {listAppointment.length ? (
                  listAppointment?.map(data => {
                    return (
                      <>
                        <CardAppointment key={data.id} data={data} />
                      </>
                    )
                  })
                ) : (
                  <div className="h-[50vh] flex items-center justify-center">
                    Not found
                  </div>
                )}
              </>
            ) : (
              <>Error 404</>
            )}
            <div className="w-[80vw] flex justify-between p-[16px] items-center">
              <button
                onClick={previousPage}
                className="py-[16px] h-[36px] w-[86px]  text-gray-700 typographyTextSmMedium border-[1px] border-solid border-gray-300 rounded-[8px] flex justify-center items-center"
              >
                Previous
              </button>
              <h1 className="text-gray-700 typographyTextSmMedium">
                Page {pageNumber} of {totalPage}
              </h1>
              <button
                onClick={nextPage}
                className="py-[16px] h-[36px] w-[86px] text-gray-700 typographyTextSmMedium border-[1px] border-solid border-gray-300 rounded-[8px] flex justify-center items-center"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <button onClick={onLogout}>Logout</button> */}
    </div>
  )
}

export default Dashboard
