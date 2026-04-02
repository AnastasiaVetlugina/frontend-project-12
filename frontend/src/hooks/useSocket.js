import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../api/authApi.js'

export const useSocket = (onNewMessage, onNewChannel, onRemoveChannel, onRenameChannel) => {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = getToken()

    socketRef.current = io({ auth: { token } })

    if (onNewMessage) socketRef.current.on('newMessage', onNewMessage)
    if (onNewChannel) socketRef.current.on('newChannel', onNewChannel)
    if (onRemoveChannel) socketRef.current.on('removeChannel', onRemoveChannel)
    if (onRenameChannel) socketRef.current.on('renameChannel', onRenameChannel)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}
