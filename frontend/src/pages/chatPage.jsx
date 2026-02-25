import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { io } from 'socket.io-client'
import { setChannels, setCurrentChannel, selectChannels, selectCurrentChannelId } from '../store/channelsSlice'
import { setMessages, addMessage, selectMessages } from '../store/messagesSlice'

const ChatPage = () => {
  const dispatch = useDispatch()
  const channels = useSelector(selectChannels)
  const currentChannelId = useSelector(selectCurrentChannelId)
  const messages = useSelector(selectMessages)

  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  const token = localStorage.getItem('token')

  useEffect(() => {
    const socket = io({ auth: { token } })

    const fetchData = async () => {
      try {
        const channelsRes = await axios.get('/api/v1/channels', {
          headers: { Authorization: `Bearer ${token}` }
        })
        dispatch(setChannels(channelsRes.data))

        const messagesRes = await axios.get('/api/v1/messages', {
          headers: { Authorization: `Bearer ${token}` }
        })
        dispatch(setMessages(messagesRes.data))

        const general = channelsRes.data.find(channel => channel.name === 'general')
        if (general) dispatch(setCurrentChannel(general.id))
      } catch (error) {
        console.error('Ошибка загрузки:', error)
      }
    }
    
    fetchData()

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    return () => socket.disconnect()
  }, [dispatch, token])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)
    try {
      await axios.post('/api/v1/messages',
        { text: newMessage, channelId: currentChannelId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewMessage('')
    } catch (err) {
      console.error('Ошибка отправки:', err)
    } finally {
      setSending(false)
    }
  }

  const currentMessages = messages.filter(m => m.channelId === currentChannelId)
  const currentChannel = channels.find(c => c.id === currentChannelId)

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map(channel => (
              <li key={channel.id} className="nav-item w-100">
                <button 
                  type="button" 
                  className={`w-100 rounded-0 text-start btn ${channel.id === currentChannelId ? 'btn-secondary' : ''}`}
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                >
                  <span className="me-1">#</span>{channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0"><b># {currentChannel?.name}</b></p>
              <span className="text-muted">{currentMessages.length} сообщения</span>
            </div>

            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {currentMessages.map(msg => (
                <div key={msg.id} className="text-break mb-2">
                  <b>{msg.username}:</b> {msg.text}
                </div>
              ))}
            </div>

            <div className="mt-auto px-5 py-3">
              <form onSubmit={handleSendMessage} noValidate className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input 
                    name="body" 
                    aria-label="Новое сообщение" 
                    placeholder="Введите сообщение..." 
                    className="border-0 p-0 ps-2 form-control" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-group-vertical" 
                    disabled={sending || !newMessage.trim()}
                  >
                    Отправить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
