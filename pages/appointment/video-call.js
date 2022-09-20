import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import Peer from 'simple-peer'

const VideoCallPage = () => {
  const [roomID, setRoomID] = useState('')
  const [token, setToken] = useState('')
  const peer = useRef()
  const socket = useRef()
  const localVideo = useRef()
  const remoteVideo = useRef()

  const onCloseRoom = () => {
    socket.current.emit('close-room')
    peer.current.destroy()
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
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
      localVideo.current.srcObject = stream
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_ENDPOINT, {
        auth: { token: `Bearer ${token}` }
      })
      socket.current.emit('join-room', roomID)
      socket.current.on('start-peering', onStartPeering)
    })
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
    </div>
  )
}

export default VideoCallPage
