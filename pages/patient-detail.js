import { useEffect, useState } from 'react'
import { router, withRouter } from 'next/router'
import dayjs from 'dayjs'
import useAPI from '../hooks/useAPI'
import Navbar from '../Components/Navbar'
import PrimaryButton from '../Components/PrimaryButton'

const PatientDetail = props => {
  const [apiDefault] = useAPI()
  const [detailAppointment, setDetailAppointment] = useState()
  var current = new Date()
  const checkIsAfterStartDateTime = dayjs(current).isAfter(
    detailAppointment?.start_date_time
  )
  const checkIsBeforeStartDateTime = dayjs(current).isBefore(
    detailAppointment?.start_date_time
  )
  const checkIsAfterEndDateTime = dayjs(current).isAfter(detailAppointment?.end_date_time)
  const checkIsBeforeEndDateTime = dayjs(current).isBefore(
    dayjs(detailAppointment?.end_date_time).add(3, 'h')
  )

  useEffect(() => {
    getDetailAppointment()
  }, [])

  const getDetailAppointment = async () => {
    const res = await apiDefault.get(`/appointment/${props.router.query.appointmentID}`)
    setDetailAppointment(res.data)
  }
  const joinMeeting = async () => {
    const res = await apiDefault.post(`/appointment/${props.router.query.appointmentID}`)
    console.log(res.data)
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
  useEffect(() => {}, [props.router.query])

  const CardPatientDetail = () => {
    return (
      <div className="border-[1px] border-solid border-gray-200 max-h-[400px] h-full rounded-[8px] mt-[39px] mx-[112px] h-[70vh] w-full max-w-[696px] flex flex-col px-[32px]">
        <h1 className="typographyHeadingSmSemibold text-base-black mt-[16px]">
          Patient Detail
        </h1>
        <h1 className="typographyTextXsRegular text-gray-600 ">Name</h1>
        <h1 className="typographyTextMdRegular text-base-black ">
          {detailAppointment?.patient?.full_name}
        </h1>
        <div className="flex mt-[8px] w-[376px] justify-between">
          <div className="flex flex-col">
            <div className="flex-col flex">
              <h1 className="typographyTextXsRegular text-gray-600">Patient Number</h1>
              <h1 className="typographyTextMdRegular text-base-black">
                {detailAppointment?.patient?.id}
              </h1>
            </div>
            <div className="mt-[19px]">
              <h1 className="typographyTextXsRegular text-gray-600">Birthdate</h1>
              <h1 className="typographyTextMdRegular text-base-black">
                {dayjs(detailAppointment?.patient?.birth_date).format('DD/MM/YYYY')}
              </h1>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <h1 className="typographyTextXsRegular text-gray-600 ">Weight</h1>
              <h1 className="typographyTextMdRegular text-base-black">
                {detailAppointment?.patient?.weight} Kg.
              </h1>
            </div>
            <div className="mt-[19px]">
              <h1 className="typographyTextXsRegular text-gray-600">Blood type</h1>
              <h1 className="typographyTextMdRegular text-[18px] text-base-black font-[500] font-[Poppins] normal">
                {detailAppointment?.patient?.blood_type}
              </h1>
            </div>
          </div>
          <div>
            <h1 className="typographyTextXsRegular text-gray-600">Height</h1>
            <h1 className="typographyTextMdRegular text-base-black">
              {detailAppointment?.patient?.height} cm
            </h1>
          </div>
        </div>
        <div className="mt-[8px]">
          <h1 className="typographyTextXsRegular text-gray-600">Detail</h1>
          <h1 className="typographyTextMdRegular text-base-black">
            {detailAppointment?.detail}
          </h1>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Navbar />
      <div className="flex">
        <CardPatientDetail />
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
              <h1 className="text-primary-500">Wait Until 10 minute Before Schedule</h1>
            ) : checkIsAfterStartDateTime && checkIsBeforeEndDateTime ? (
              <div className="w-[235px] ">
                <PrimaryButton text="join meeting" width="235px" onClick={joinMeeting} />
              </div>
            ) : checkIsAfterEndDateTime ? (
              <h1 className="text-primary-500">Your Miss this schedule</h1>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {/* <button onClick={onLogout}>Logout</button> */}
    </div>
  )
}
export default withRouter(PatientDetail)
