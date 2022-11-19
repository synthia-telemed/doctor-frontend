import { useEffect, useState } from 'react'
import { router, withRouter } from 'next/router'
import dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import useAPI from '../hooks/useAPI'
import useAPIMeasurement from '../hooks/useApiMeasurement'

import Navbar from '../Components/Navbar'
import ButtonPanel from '../Components/ButtonPanel'
import PrimaryButton from '../Components/PrimaryButton'
import CardPatientDetail from '../Components/CardPatientDetail'
import DateRangeTimePicker from '../Components/DateRangeTimePicker'
import GlucoseGraph from '../Components/GlucoseGraph'
import PulseGraph from '../Components/PulseGraph'
import BloodPressureGraph from '../Components/BloodPressureGraph'

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
  const [pulseData, setPulseData] = useState([])
  const [bloodPressureData, setBloodPressureData] = useState([])
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
  const onClickFasting = () => {
    setClickDettailGraphFasting(!clickDetailGraphFasting)
  }
  const onClickBeforeMeal = () => {
    setClickDettailGraphBeforeMeal(!clickDetailGraphBeforeMeal)
  }
  const onClickAfterMeal = () => {
    setClickDettailGraphAfterMeal(!clickDetailGraphAfterMeal)
  }

  useEffect(() => {
    getDetailAppointment()
    getGlucoseData()
    getPulseData()
    getBloodPressureData()
  }, [])
  useEffect(() => {
    getGlucoseData()
    getPulseData()
    getBloodPressureData()
  }, [subtractDate])

  const getGlucoseData = async () => {
    const query = { from: subtractDate.toISOString(), to: date.toISOString() }
    const res = await apiMeasurement.get(
      `/glucose/visualization/doctor/${props.router.query.appointmentID}`,
      { params: query }
    )
    setGlucoseData(res.data)
  }
  const getBloodPressureData = async () => {
    const query = { from: subtractDate.toISOString(), to: date.toISOString() }
    const res = await apiMeasurement.get(
      `/blood-pressure/visualization/doctor/${props.router.query.appointmentID}`,
      { params: query }
    )
    setBloodPressureData(res.data)
  }
  const getPulseData = async () => {
    const query = { from: subtractDate.toISOString(), to: date.toISOString() }
    const res = await apiMeasurement.get(
      `/pulse/visualization/doctor/${props.router.query.appointmentID}`,
      { params: query }
    )
    setPulseData(res.data)
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
      <div className="mx-[112px]">
        <GlucoseGraph
          glucoseData={glucoseData}
          onClickAfterMeal={onClickAfterMeal}
          onClickBeforeMeal={onClickBeforeMeal}
          onClickFasting={onClickFasting}
          clickDetailGraphAfterMeal={clickDetailGraphAfterMeal}
          clickDetailGraphBeforeMeal={clickDetailGraphBeforeMeal}
          clickDetailGraphFasting={clickDetailGraphFasting}
          xLabel={glucoseData?.xLabel}
        />
        <PulseGraph pulseData={pulseData} xLabel={pulseData?.xLabel} />
        <BloodPressureGraph
          bloodPressureData={bloodPressureData}
          xLabel={bloodPressureData?.xLabel}
        />
      </div>

      {/* <button onClick={onLogout}>Logout</button> */}
    </div>
  )
}
export default withRouter(PatientDetail)
