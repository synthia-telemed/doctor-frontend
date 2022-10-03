import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import Peer from 'simple-peer'

const VideoCallPage = () => {
  const [roomID, setRoomID] = useState('')
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const { token } = useSelector(state => state.user)

  const socket = useRef()
  const localVideo = useRef()
  const remoteVideo = useRef()

  const stopMediaStream = stream => {
    stream.getAudioTracks().forEach(track => track.stop())
    stream.getVideoTracks().forEach(track => track.stop())
  }
  const onCloseRoom = () => {
    socket.current.emit('close-room')
    if (remoteVideo.current.srcObject) stopMediaStream(remoteVideo.current.srcObject)
    if (localVideo.current.srcObject) stopMediaStream(localVideo.current.srcObject)
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
    socket.current.on('room-closed', duration => {
      console.log('Closing the room', duration)
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
    socket.current.emit('join-room', roomID)
    socket.current.on('start-peering', onStartPeering)
  }

  useEffect(() => {
    requestMediaDevice()
      .then(() => {
        console.log('success get media device')
        // onEnterRoom()
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
