import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setChannels, setCurrentChannel, selectChannels, selectCurrentChannelId } from '../store/channelsSlice'
import { setMessages, selectMessages } from '../store/messagesSlice'

const ChatPage = () => {
  const dispatch = useDispatch()
  const channels = useSelector(selectChannels)
  const currentChannelId = useSelector(selectCurrentChannelId)
  const messages = useSelector(selectMessages)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
      
        const channelsRes = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` }
        })
      
        dispatch(setChannels(channelsRes.data))

        const messagesRes = await axios.get('/api/v1/messages', {
          headers: { Authorization: `Bearer ${token}` }
        })

        dispatch(setMessages(messagesRes.data))
      
        if (channelsRes.data.length > 0) {
        dispatch(setCurrentChannel(channelsRes.data[0].id))
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }
    fetchData()
  }, [dispatch])

  const currentMessages = messages.filter(message => message.channelId === currentChannelId)

  return (
    <div className="container h-100 my-4">
      <div className="row h-100">
        <div className="col-4 col-md-2 border-end">
          <b>Каналы</b>
          <ul>
            {channels.map(channel => (
              <li key={channel.id}>
                <button onClick={() => dispatch(setCurrentChannel(channel.id))}>
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col">
          <div>
            {currentMessages.map(msg => (
              <div key={msg.id}>
                <b>{msg.username}:</b> {msg.text}
              </div>
            ))}
          </div>

          <div>
            <input type="text" placeholder="Введите сообщение..." />
            <button>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

