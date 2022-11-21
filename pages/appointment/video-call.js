import { useEffect, useRef, useState } from 'react'
import { router, withRouter } from 'next/router'
import VideoCallOffIcon from '../../Components/Assets/VideoCallOffIcon'
import VideoCallOnIcon from '../../Components/Assets/VideoCallonIcon'
import MicrophoneOffIcon from '../../Components/Assets/MicrophoneOffIcon'
import MicrophoneOnIcon from '../../Components/Assets/MicrophoneOnIcon'
import useAPIMeasurement from '../../hooks/useApiMeasurement'
import * as utc from 'dayjs/plugin/utc'
import EndCallIcon from '../../Components/Assets/EndCallIcon'
import IconCall from '../../Components/Assets/CallIcon'
import ProfileIcon from '../../Components/Assets/ProfileIcon'
import ProfileIconBold from '../../Components/Assets/ProfileIconBold'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import useAPI from '../../hooks/useAPI'
import GlucoseGraph from '../../Components/GlucoseGraph'
import PulseGraph from '../../Components/PulseGraph'
import BloodPressureGraph from '../../Components/BloodPressureGraph'

dayjs.extend(utc)

const VideoCallPage = props => {
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [openDetailPatient, setOpenDetailPateint] = useState(false)
  const [appointmentStatus, setAppointmentStatus] = useState('LEAVE')
  const [appointmentDetail, setAppointmentDetail] = useState({})
  const [glucoseData, setGlucoseData] = useState([])
  const [pulseData, setPulseData] = useState([])
  const [bloodPressureData, setBloodPressureData] = useState([])
  const [clickDetailGraphFasting, setClickDettailGraphFasting] = useState(false)
  const [clickDetailGraphAfterMeal, setClickDettailGraphAfterMeal] = useState(false)
  const [clickDetailGraphBeforeMeal, setClickDettailGraphBeforeMeal] = useState(false)
  const [date, setDate] = useState(new Date())
  const [subtractDate, setSubtractDate] = useState(
    dayjs(date).subtract(1, 'month').toDate()
  )
  const { token } = useSelector(state => state.user)
  const [api] = useAPI()
  const [apiMeasurement] = useAPIMeasurement()

  const socket = useRef()
  const localVideo = useRef()
  const remoteVideo = useRef()

  const stopMediaStream = stream => {
    stream.getAudioTracks().forEach(track => track.stop())
    stream.getVideoTracks().forEach(track => track.stop())
  }
  const onCloseRoom = async () => {
    if (remoteVideo.current?.srcObject) stopMediaStream(remoteVideo.current.srcObject)
    if (localVideo.current?.srcObject) stopMediaStream(localVideo.current.srcObject)
    if (appointmentStatus === 'LEAVE') {
      socket.current.disconnect()
    } else {
      socket.current.emit('close-room')
      await api.post('/appointment/complete', { status: appointmentStatus })
    }
    router.push(
      {
        pathname: '/patient-detail',
        query: {
          appointmentID: props.router.query.appointmentID
        }
      },
      '/patient-detail',
      { shallow: false }
    )
  }

  const onStartPeering = isInitiator => {
    console.log('got start-peering', isInitiator)
    socket.current.off('start-peering', onStartPeering)
    const peer = new Peer({
      stream: localVideo.current.srcObject,
      initiator: isInitiator
    })
    peer.on('signal', data => {
      socket.current.emit('signal', data)
    })
    peer.on('stream', stream => {
      console.log('got stream')
      remoteVideo.current.srcObject = stream
    })
    peer.on('connect', () => {
      console.log('Peer connected')
    })

    socket.current.on('signal', data => {
      peer.signal(data)
    })
    socket.current.on('room-closed', async duration => {
      console.log('Closing the room', duration)
      await api.post('/appointment/complete', { status: appointmentStatus })
      if (remoteVideo.current.srcObject) stopMediaStream(remoteVideo.current.srcObject)
      if (localVideo.current.srcObject) stopMediaStream(localVideo.current.srcObject)
    })

    socket.current.on('user-left', () => {
      console.log('User left')
      if (remoteVideo.current.srcObject) stopMediaStream(remoteVideo.current.srcObject)
      peer.destroy()
      socket.current.disconnect()
      onEnterRoom()
    })
  }

  const onEnterRoom = () => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_ENDPOINT, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket']
    })
    socket.current.on('error', err => {
      console.err('socket error', err)
    })
    socket.current.emit('join-room', props.router.query.roomID)
    socket.current.on('start-peering', onStartPeering)
  }
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

  useEffect(() => {
    fetchDetailAppointment()
    getGlucoseData()
    getPulseData()
    getBloodPressureData()
    requestMediaDevice()
      .then(() => {
        console.log('success get media device')
        onEnterRoom()
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const requestMediaDevice = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    localVideo.current.srcObject = stream
    setIsCameraOn(true)
    setIsMicOn(true)
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

  const onToggleMic = async () => {
    if (!localVideo.current) await requestMediaDevice()
    localVideo.current.srcObject
      .getAudioTracks()
      .forEach(track => (track.enabled = !isMicOn))
    setIsMicOn(!isMicOn)
  }

  const onClickOpenDetailPatient = () => {
    setOpenDetailPateint(!openDetailPatient)
  }
  const fetchDetailAppointment = async () => {
    const res = await api.get(`/appointment/${props.router.query.appointmentID}`)
    setAppointmentDetail(res.data)
  }

  const onToggleCamera = async () => {
    if (!localVideo.current) await requestMediaDevice()
    localVideo.current.srcObject
      .getVideoTracks()
      .forEach(track => (track.enabled = !isCameraOn))
    setIsCameraOn(!isCameraOn)
  }

  return (
    <div>
      <div className="flex p-[32px] bg-base-black h-screen">
        <video
          playsInline
          autoPlay
          ref={remoteVideo}
          className={`object-cover  absolute rounded-[16px]  ${
            openDetailPatient
              ? 'h-[80vh] w-[50vw]'
              : 'w-[90vw] h-[80vh] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-57%]'
          }   `}
        ></video>
        <div className="absolute top-[5%] left-[75%]">
          <div
            className={`relative z-10 w-[20vw] h-[20vh] ${
              openDetailPatient ? 'w-[10vw]' : ''
            }`}
          >
            <video
              className={`object-cover w-full h-full absolute ${
                openDetailPatient ? 'right-[350%]' : 'top-[5%] right-[5%]'
              }  rounded-[16px]  `}
              playsInline
              autoPlay
              ref={localVideo}
              muted
            ></video>
            {isMicOn ? (
              <></>
            ) : (
              <div
                className={`absolute top-[80%] ${
                  openDetailPatient ? 'right-[370%]' : ' left-[5%]'
                } z-100`}
              >
                <MicrophoneOffIcon color="red" />
              </div>
            )}
          </div>
        </div>
        {openDetailPatient ? (
          <div className="bg-base-white w-[45vw] h-[80vh] absolute right-[0%] m-[20px] rounded-[16px] p-[16px] overflow-auto">
            <h1 className="typographyHeadingSmSemibold text-base-black mt-[16px]">
              Patient Detail
            </h1>
            <h1 className="typographyTextXsRegular text-gray-600 ">Name</h1>
            <h1 className="typographyTextMdRegular text-base-black ">
              {appointmentDetail?.patient?.full_name}
            </h1>
            <div className="flex mt-[8px] w-[376px] justify-between">
              <div className="flex flex-col">
                <div className="flex-col flex">
                  <h1 className="typographyTextXsRegular text-gray-600">
                    Patient Number
                  </h1>
                  <h1 className="typographyTextMdRegular text-base-black">
                    {appointmentDetail?.patient?.id}
                  </h1>
                </div>
                <div className="mt-[19px]">
                  <h1 className="typographyTextXsRegular text-gray-600">Birthdate</h1>
                  <h1 className="typographyTextMdRegular text-base-black">
                    {dayjs(appointmentDetail?.patient?.birth_date).format('DD/MM/YYYY')}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col">
                <div>
                  <h1 className="typographyTextXsRegular text-gray-600 ">Weight</h1>
                  <h1 className="typographyTextMdRegular text-base-black">
                    {appointmentDetail?.patient?.weight} Kg.
                  </h1>
                </div>
                <div className="mt-[19px]">
                  <h1 className="typographyTextXsRegular text-gray-600">Blood type</h1>
                  <h1 className="typographyTextMdRegular text-[18px] text-base-black font-[500] font-[Poppins] normal">
                    {appointmentDetail?.patient?.blood_type}
                  </h1>
                </div>
              </div>
              <div>
                <h1 className="typographyTextXsRegular text-gray-600">Height</h1>
                <h1 className="typographyTextMdRegular text-base-black">
                  {appointmentDetail?.patient?.height} cm
                </h1>
              </div>
            </div>
            <div className="mt-[8px]">
              <h1 className="typographyTextXsRegular text-gray-600">Detail</h1>
              <h1 className="typographyTextMdRegular text-base-black">
                {appointmentDetail?.detail}
              </h1>
            </div>
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
        ) : (
          <></>
        )}
      </div>
      <div className="flex justify-between items-center mt-[64px] bg-base-white absolute bottom-0 w-full h-[96px] px-[80px] z-50 absolute">
        <div>
          <h1 className="typographyTextMdMedium text-[16px] text-base-black">
            Meeting Detail
          </h1>
        </div>
        <div className="flex ml-[40px]">
          <button
            onClick={onToggleMic}
            className="bg-[#131517A1] rounded-[32px] w-[48px] h-[48px] background-blur-[3px] flex justify-center items-center mr-[40px]"
          >
            {isMicOn ? <MicrophoneOnIcon /> : <MicrophoneOffIcon />}
          </button>

          <button
            onClick={onToggleCamera}
            className="bg-[#131517A1] rounded-[32px] w-[48px] h-[48px] background-blur-[3px] flex justify-center items-center "
          >
            {isCameraOn ? <VideoCallOnIcon /> : <VideoCallOffIcon />}
          </button>
        </div>
        <div className="flex items-center">
          <div
            className={`flex flex-col justify-center items-center w-[64px] h-[80px] rounded-[16px] ${
              openDetailPatient ? 'bg-primary-50' : ''
            }`}
            onClick={onClickOpenDetailPatient}
          >
            {openDetailPatient ? <ProfileIconBold /> : <ProfileIcon color={'#475467'} />}
            <h1
              className={`typographyTextXsMedium mt-[8px] ${
                openDetailPatient ? 'text-primary-500' : 'text-gray-600'
              } `}
            >
              Patient
            </h1>
          </div>
          <div className="flex items-center bg-[#FB0242] rounded-[16px] h-[40px] ml-[36px]">
            <button
              onClick={onCloseRoom}
              className="  w-[48px] h-[40px] flex justify-center items-center"
            >
              <IconCall />
            </button>
            <select
              className="bg-[#FB0242] text-base-white rounded-[16px] mr-[24px]"
              name="Appointment status"
              onChange={e => setAppointmentStatus(e.target.value)}
            >
              <option value="LEAVE">Leave</option>
              <option value="COMPLETED">Complete</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(VideoCallPage)
