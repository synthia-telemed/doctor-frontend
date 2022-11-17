import { useEffect, useState } from 'react'
import { router, withRouter } from 'next/router'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import useAPI from '../hooks/useAPI'
import useAPIMeasurement from '../hooks/useApiMeasurement'
import GroupBadgeStatus from '../Components/GroupBadgeStatus'
import Navbar from '../Components/Navbar'
import ButtonPanel from '../Components/ButtonPanel'
import PrimaryButton from '../Components/PrimaryButton'
import CardPatientDetail from '../Components/CardPatientDetail'
import DateRangeTimePicker from '../Components/DateRangeTimePicker'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import BadgeStatus from '../Components/BadgeStatus'

dayjs.extend(utc)

const PatientDetail = props => {
  const [apiDefault] = useAPI()
  const [apiMeasurement] = useAPIMeasurement()
  const [detailAppointment, setDetailAppointment] = useState()
  const [date, setDate] = useState(new Date())
  const [subtractDate, setSubtractDate] = useState(
    dayjs(date).subtract(1, 'month').toDate()
  )
  const appointmentDateTime = dayjs.utc(detailAppointment?.start_date_time)
  const [panel, setPanel] = useState('Month')
  const [glucoseData, setGlucoseData] = useState([])
  const [clickDetailGraphFasting, setClickDettailGraphFasting] = useState(false)
  const [clickDetailGraphAfterMeal, setClickDettailGraphAfterMeal] = useState(false)
  const [clickDetailGraphBeforeMeal, setClickDettailGraphBeforeMeal] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (panel === 'Month') {
      setSubtractDate(dayjs(date).subtract(1, 'month').toDate())
    }
    if (panel === '3 Months') {
      setSubtractDate(dayjs(date).subtract(3, 'month').toDate())
    }
    if (panel === '6 Months') {
      setSubtractDate(dayjs(date).subtract(6, 'month').toDate())
    }
  }, [panel])

  const checkIsBeforeStartDateTime = dayjs().isBefore(
    appointmentDateTime.subtract(10, 'minute'),
    'minute'
  )
  const checkIsAfterEndDateTime = dayjs().isAfter(
    appointmentDateTime.add(3, 'hour'),
    'minute'
  )
  const onChangeDateRangePicker = value => {
    // setStartTime(value === null ? '' : value[0])
    // setEndTime(value === null ? '' : value[1])
    setDate(value === null ? '' : value[0])
    setSubtractDate(value === null ? '' : value[1])
    setPanel('')
  }

  useEffect(() => {
    getDetailAppointment()
    getGlucoseData()
  }, [])
  useEffect(() => {
    getGlucoseData()
  }, [subtractDate])

  const getGlucoseData = async () => {
    const query = { from: subtractDate.toISOString(), to: date.toISOString() }
    const res = await apiMeasurement.get(
      `/glucose/visualization/doctor/${props.router.query.appointmentID}`,
      { params: query }
    )

    setGlucoseData(res.data)
  }

  const getDetailAppointment = async () => {
    const res = await apiDefault.get(`/appointment/${props.router.query.appointmentID}`)
    setDetailAppointment(res.data)
  }

  const joinMeeting = async () => {
    const res = await apiDefault.post(`/appointment/${props.router.query.appointmentID}`)
    router.push(
      {
        pathname: '/appointment/video-call',
        query: {
          roomID: res.data.room_id,
          appointmentID: props.router.query.appointmentID
        }
      },
      '/appointment/video-call',
      { shallow: false }
    )
  }
  return (
    <div className="mt-[120px]">
      <Navbar />
      <div className="flex">
        <CardPatientDetail detailAppointment={detailAppointment} />
        <div className="border-[1px] border-solid border-gray-200 rounded-[8px] mt-[39px] mx-[112px] h-[70vh] w-full max-w-[416px] max-h-[300px] h-full px-[32px]">
          <h1 className="typographyHeadingSmSemibold mt-[16px] text-base-black ">
            Schedule
          </h1>

          <div className="mt-[48px] flex">
            <img src="/image/Time Circle.svg" alt="" className="mr-[16px]" />
            <h1 className="typographyTextMdRegular text-base-black">
              {dayjs(detailAppointment?.start_date_time).format('dddd, DD MMMM YYYY')}
            </h1>
          </div>
          <div className="flex mt-[18px] items-center">
            <img src="/image/Calendar.svg" alt="" className="mr-[16px]" />
            <h1 className="typographyTextMdRegular text-base-black">
              {dayjs(detailAppointment?.start_date_time).format('HH:mm')} -{' '}
              {dayjs(detailAppointment?.end_date_time).format('HH:mm A')}
            </h1>
          </div>
          <div className="justify-center flex mt-[48px]">
            {checkIsBeforeStartDateTime ? (
              <h1 className="text-primary-500 typographyTextMdRegular">
                You can join the meeting 10 minutes before the appointment time
              </h1>
            ) : checkIsAfterEndDateTime ? (
              <h1 className="text-primary-500">Your Miss the schedule time</h1>
            ) : (
              <div className="w-[235px] ">
                <PrimaryButton text="join meeting" width="235px" onClick={joinMeeting} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" flex mx-[112px] w-[80vw] items-center justify-between mt-[31px]">
        <h1 className="typographyHeadingSmSemibold text-base-black ">Patient Report</h1>
        <div className="flex justify-between w-[600px]">
          <div className="flex">
            <ButtonPanel
              text="Month"
              value="Month"
              panel={panel}
              onClick={() => setPanel('Month')}
              style="border-b-[1px] border-l-[1px] border-t-[1px] border-solid border-gray-300 rounded-bl-[6px] rounded-tl-[6px]"
            />
            <ButtonPanel
              text="3 Months"
              value="3 Months"
              panel={panel}
              onClick={() => setPanel('3 Months')}
              style="border-[1px] border-solid border-gray-300"
            />
            <ButtonPanel
              text="6 Months"
              value="6 Months"
              panel={panel}
              onClick={() => setPanel('6 Months')}
              style="border-b-[1px] border-r-[1px] border-t-[1px] border-solid border-gray-300 rounded-br-[6px] rounded-tr-[6px]"
            />
          </div>
          <DateRangeTimePicker
            endDate={subtractDate}
            startDate={dayjs(date).toDate()}
            onChange={onChangeDateRangePicker}
            startTime={startTime}
            endTime={endTime}
          />
        </div>
      </div>
      <div className="mx-[100px] mb-[200px]">
        <div className=" mt-[28px]">
          <h1 className="typographyTextLgSemibold text-base-black">Glucose</h1>
          <h1 className="typographyTextXsMedium text-gray-600 mt-[5px]">
            Total Avg this day
          </h1>
          <div className="flex flex-col">
            {/* {checkGlucoseData()} */}
            {glucoseData?.summary?.fasting?.hyperglycemia.length ||
            glucoseData?.summary?.fasting?.hypoglycemia.length ||
            glucoseData?.summary?.fasting?.normal.length ||
            glucoseData?.summary?.fasting?.warning.length ? (
              <div>
                <div
                  className="flex items-center"
                  onClick={() => setClickDettailGraphFasting(!clickDetailGraphFasting)}
                >
                  <div className="w-[16px] h-[16px] bg-[#131957] rounded-[16px]"></div>{' '}
                  <h1 className="typographyTextMdRegular ml-[4px] text-gray-600 mr-[16px]">
                    Fasting
                  </h1>
                  <GroupBadgeStatus
                    data={glucoseData?.summary?.fasting}
                    dataName="fasting"
                    isClick={clickDetailGraphFasting}
                  />
                </div>
                {clickDetailGraphFasting ? (
                  <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                    {glucoseData?.summary?.fasting?.warning.length &&
                      glucoseData?.summary?.fasting?.warning.map(item => {
                        return (
                          <div className="flex justify-between w-[418px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                            <h1 className="typographyTextXsMedium text-gray-500">
                              {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                            </h1>
                            <h1 className="text-warning-600 typographyTextXsMedium">
                              {' '}
                              {item.value} {glucoseData.unit}
                            </h1>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}

            {glucoseData?.summary?.beforeMeal?.hyperglycemia.length ||
            glucoseData?.summary?.beforeMeal?.hypoglycemia.length ||
            glucoseData?.summary?.beforeMeal?.normal.length ? (
              <div>
                <div
                  className="flex items-center"
                  onClick={() =>
                    setClickDettailGraphBeforeMeal(!clickDetailGraphBeforeMeal)
                  }
                >
                  <div className="w-[16px] h-[16px] bg-[#303ed9] rounded-[16px]"></div>{' '}
                  <h1 className="typographyTextMdRegular ml-[4px] text-gray-600">
                    BeforeMeal
                  </h1>
                  <GroupBadgeStatus
                    data={glucoseData?.summary?.beforeMeal}
                    dataName="beforemeal"
                    isClick={clickDetailGraphBeforeMeal}
                  />
                </div>
                {clickDetailGraphBeforeMeal ? (
                  <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                    {glucoseData?.summary?.afterMeal?.warning.length &&
                      glucoseData?.summary?.afterMeal?.warning.map(item => {
                        return (
                          <div className="flex justify-between w-[418px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                            <h1 className="typographyTextXsMedium text-gray-500">
                              {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                            </h1>
                            <h1 className="text-warning-600 typographyTextXsMedium">
                              {' '}
                              {item.value} {glucoseData.unit}
                            </h1>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}

            {glucoseData?.summary?.afterMeal?.hyperglycemia.length ||
            glucoseData?.summary?.afterMeal?.hypoglycemia.length ||
            glucoseData?.summary?.afterMeal?.normal.length ? (
              <div>
                <div
                  className="flex items-center"
                  onClick={() =>
                    setClickDettailGraphAfterMeal(!clickDetailGraphAfterMeal)
                  }
                >
                  <div className="w-[16px] h-[16px] bg-[#4F84F6] rounded-[16px]"></div>{' '}
                  <h1 className="typographyTextMdRegular ml-[4px] text-gray-600">
                    AfterMeal
                  </h1>
                  <GroupBadgeStatus
                    data={glucoseData?.summary?.afterMeal}
                    dataName="aftermeal"
                    isClick={clickDetailGraphAfterMeal}
                  />
                </div>
                {clickDetailGraphAfterMeal ? (
                  <div className="pt-[8px] bg-gray-50 w-[418px] rounded-[8px]">
                    {glucoseData?.summary?.afterMeal?.warning.length &&
                      glucoseData?.summary?.afterMeal?.warning.map(item => {
                        return (
                          <div className="flex justify-between w-[418px] mb-[8px] border-b-[1px] border-solid border-gray-200">
                            <h1 className="typographyTextXsMedium text-gray-500">
                              {dayjs(item.dateTime).format('DD MMM YYYY, HH:mm A')}
                            </h1>
                            <h1 className="text-warning-600 typographyTextXsMedium">
                              {' '}
                              {item.value} {glucoseData.unit}
                            </h1>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240} className="ml-[-24px] mt-[24px]">
          <LineChart width="100%" height={250} className="mt-[5px]">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              allowDuplicatedCategory={false}
              // label={glucoseData.xLabel}
              interval="preserveStartEnd"
              ticks={glucoseData?.ticks}
              axisLine={false}
              // domain={data?.domain}
              domain={glucoseData?.domain}
              type="number"
              className="typographyTextXsMedium"
              tick={{ fontSize: 12 }}
              width="100%"
              tickFormatter={t => dayjs.unix(t).format('DD MMM')}
            />

            <YAxis
              domain={[0, 200]}
              axisLine={false}
              className="typographyTextXsMedium"
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              layout="horizontal"
              verticalAlign="top"
              align="right"
              iconType="circle"
            />
            <>
              <Line
                name="Fasting"
                data={glucoseData?.data?.fasting}
                dataKey="value"
                stroke="#131957"
                fill="#131957"
                radius={30}
              ></Line>
              <Line
                name="BeforeMeal"
                data={glucoseData?.data?.beforeMeal}
                dataKey="value"
                stroke="#303ed9"
                fill="#303ed9"
                radius={30}
              ></Line>
              <Line
                name="AfterMeal"
                data={glucoseData?.data?.afterMeal}
                dataKey="value"
                stroke="#4F84F6"
                fill="#4F84F6"
                radius={30}
              ></Line>
            </>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* <button onClick={onLogout}>Logout</button> */}
    </div>
  )
}
export default withRouter(PatientDetail)
