import { useEffect, useRef, useState } from 'react'
import { router, withRouter } from 'next/router'
import VideoCallOffIcon from '../../Components/Assets/VideoCallOffIcon'
import VideoCallOnIcon from '../../Components/Assets/VideoCallonIcon'
import MicrophoneOffIcon from '../../Components/Assets/MicrophoneOffIcon'
import MicrophoneOnIcon from '../../Components/Assets/MicrophoneOnIcon'
import EndCallIcon from '../../Components/Assets/EndCallIcon'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import useAPI from '../../hooks/useAPI'

const VideoCallPage = props => {
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [appointmentStatus, setAppointmentStatus] = useState('COMPLETED')
  const { token } = useSelector(state => state.user)
  const [api] = useAPI()

  const socket = useRef()
  const localVideo = useRef()
  const remoteVideo = useRef()

  const stopMediaStream = stream => {
    stream.getAudioTracks().forEach(track => track.stop())
    stream.getVideoTracks().forEach(track => track.stop())
  }
  const onCloseRoom = () => {
    socket.current.emit('close-room')
    if (remoteVideo.current?.srcObject) stopMediaStream(remoteVideo.current.srcObject)
    if (localVideo.current?.srcObject) stopMediaStream(localVideo.current.srcObject)
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

  const onEnterRoom = ({ roomID, jwtToken }) => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_ENDPOINT, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket']
    })
    socket.current.on('error', err => {
      console.err('socket error', err)
    })
    socket.current.emit('join-room', roomID)
    socket.current.on('start-peering', onStartPeering)
  }

  useEffect(() => {
    requestMediaDevice()
      .then(() => {
        console.log('success get media device')
        onEnterRoom({
          roomID: props.router.query.roomID,
          jwtToken: token
        })
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

  const onToggleMic = async () => {
    if (!localVideo.current) await requestMediaDevice()
    localVideo.current.srcObject
      .getAudioTracks()
      .forEach(track => (track.enabled = !isMicOn))
    setIsMicOn(!isMicOn)
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
      <div className="flex justify-between p-[32px]">
        <div className="relative">
          <video
            className={`relative object-cover`}
            playsInline
            autoPlay
            ref={localVideo}
            muted
          ></video>
          {isMicOn ? (
            <></>
          ) : (
            <div className="absolute top-[90%] right-[10%] z-10">
              <MicrophoneOffIcon color="red" />
            </div>
          )}
        </div>
        <video playsInline autoPlay ref={remoteVideo}></video>
      </div>
      <div className="flex justify-center mt-[64px]">
        <button
          onClick={onToggleCamera}
          className="bg-[#131517A1] rounded-[32px] w-[48px] h-[48px] background-blur-[3px] flex justify-center items-center "
        >
          {isCameraOn ? <VideoCallOnIcon /> : <VideoCallOffIcon />}
        </button>
        <div className="flex items-center  mx-[32px]">
          <button
            onClick={onCloseRoom}
            className="bg-[#FB0242] rounded-[32px] w-[48px] h-[48px] background-blur-[3px] flex justify-center items-center mr-[16px]"
          >
            <EndCallIcon />
          </button>
          <select
            name="Appointment status"
            onChange={e => setAppointmentStatus(e.target.value)}
          >
            <option value="COMPLETED">Complete</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <button
          onClick={onToggleMic}
          className="bg-[#131517A1] rounded-[32px] w-[48px] h-[48px] background-blur-[3px] flex justify-center items-center"
        >
          {isMicOn ? <MicrophoneOnIcon /> : <MicrophoneOffIcon />}
        </button>
      </div>
    </div>
  )
}

export default withRouter(VideoCallPage)
