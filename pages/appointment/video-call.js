import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import Peer from 'simple-peer'

const VideoCallPage = () => {
  const [roomID, setRoomID] = useState('')
  const [token, setToken] = useState('')
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)

  const peer = useRef()
  const socket = useRef()
  const localVideo = useRef()
  const remoteVideo = useRef()

  const onCloseRoom = () => {
    socket.current.emit('close-room')
    peer.current.destroy()
    remoteVideo.current = undefined
    localVideo.current = undefined
  }

  const onStartPeering = isInitiator => {
    console.log('got start-peering', isInitiator)
    peer.current = new Peer({
      stream: localVideo.current.srcObject,
      initiator: isInitiator
    })
    peer.current.on('signal', data => {
      socket.current.emit('signal', data)
    })
    peer.current.on('stream', stream => {
      console.log('got stream')
      remoteVideo.current.srcObject = stream
    })
    peer.current.on('connect', () => {
      console.log('Peer connected')
    })
    socket.current.on('signal', data => {
      peer.current.signal(data)
    })
  }

  const onEnterRoom = () => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_ENDPOINT, {
      auth: { token: `Bearer ${token}` }
    })
    socket.current.emit('join-room', roomID)
    socket.current.on('start-peering', onStartPeering)
  }

  useEffect(() => {
    requestMediaDevice()
      .then(() => {
        console.log('success get media device')
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
    console.log('audio', localVideo.current.srcObject.getAudioTracks())
    localVideo.current.srcObject.getAudioTracks()[0].enabled = !isMicOn
    setIsMicOn(!isMicOn)
  }

  const onToggleCamera = async () => {
    if (!localVideo.current) await requestMediaDevice()
    console.log('video', localVideo.current.srcObject.getVideoTracks())
    localVideo.current.srcObject.getVideoTracks()[0].enabled = !isCameraOn
    setIsCameraOn(!isCameraOn)
  }

  return (
    <div>
      <h1>Video Call Page</h1>
      <input placeholder="token" value={token} onChange={v => setToken(v.target.value)} />
      <input
        placeholder="roomID"
        value={roomID}
        onChange={v => setRoomID(v.target.value)}
      />
      <button onClick={onEnterRoom}>Ready Ka</button>
      <video playsInline autoPlay ref={localVideo} muted></video>
      <video playsInline autoPlay ref={remoteVideo}></video>
      <button onClick={onCloseRoom}>Close Room</button>
      <button onClick={onToggleCamera}>
        {isCameraOn ? 'Close Camera' : 'Open Camera'}
      </button>
      <button onClick={onToggleMic}>{isMicOn ? 'Mute' : 'Unmute'}</button>
    </div>
  )
}

export default VideoCallPage
