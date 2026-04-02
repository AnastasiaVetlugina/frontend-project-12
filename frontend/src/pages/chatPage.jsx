import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import profanity from '../utils/profanity'
import {
  setChannels,
  setCurrentChannel,
  addChannel,
  removeChannel,
  renameChannel,
  selectChannels,
  selectCurrentChannelId,
} from "../store/channelsSlice"
import {
  setMessages,
  addMessage,
  selectMessages,
} from "../store/messagesSlice"
import AddChannelModal from "../components/addChannelModal.jsx"
import RemoveChannelModal from "../components/removeChannelModal.jsx"
import RenameChannelModal from "../components/renameChannelModal.jsx"
import ChannelMenu from "../components/channelMenu.jsx"
import store from "../store/index.js"
import { getToken, getUsername, removeToken, removeUsername } from "../api/authApi.js"
import { useSocket } from "../hooks/useSocket.js"

const ChatPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const channels = useSelector(selectChannels)
  const channelNames = channels.map((ch) => ch.name)
  const currentChannelId = useSelector(selectCurrentChannelId)
  const messages = useSelector(selectMessages)

  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddChannel, setShowAddChannel] = useState(false)
  const [showRemoveChannel, setShowRemoveChannel] = useState(null)
  const [showRenameChannel, setShowRenameChannel] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const token = getToken()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentChannelId])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentChannelId])

  const handleNewMessage = (message) => {
    dispatch(addMessage(message))
  }

  const handleNewChannel = (channel) => {
    dispatch(addChannel(channel))
  }

  const handleRemoveChannelSocket = ({ id }) => {
    dispatch(removeChannel(id))
    const state = store.getState()
    if (state.channels.currentChannelId === id) {
      const general = state.channels.channels.find(ch => ch.name === 'general')
      if (general) dispatch(setCurrentChannel(general.id))
    }
  }

  const handleRenameChannelSocket = ({ id, name }) => {
    dispatch(renameChannel({ id, name }))
  }

  useSocket(handleNewMessage, handleNewChannel, handleRemoveChannelSocket, handleRenameChannelSocket)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const channelsRes = await axios.get("/api/v1/channels", {
          headers: { Authorization: `Bearer ${token}` },
        })
        dispatch(setChannels(channelsRes.data))

        const messagesRes = await axios.get("/api/v1/messages", {
          headers: { Authorization: `Bearer ${token}` },
        })
        dispatch(setMessages(messagesRes.data))

        const general = channelsRes.data.find(
          (channel) => channel.name === "general",
        )
        if (general) dispatch(setCurrentChannel(general.id))
      } catch (error) {
        if (error.response?.status === 401) {
          removeToken()
          removeUsername()
          window.location = '/login'
        } else if (!navigator.onLine) {
          toast.error(t('errors.network'))
        } else {
          toast.error(t('errors.loading'))
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [dispatch, token, t])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)
    try {
      const cleanMessage = profanity.clean(newMessage)
      const username = getUsername()

      await axios.post(
        "/api/v1/messages",
        { text: cleanMessage, channelId: currentChannelId, username: username },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setNewMessage("")
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken()
        removeUsername()
        window.location = '/login'
      } else {
        toast.error(t('errors.sending'))
      }
    } finally {
      setSending(false)
    }
  }

  const handleAddChannel = async (channelName) => {
    try {
      const cleanName = profanity.clean(channelName)

      const response = await axios.post(
        "/api/v1/channels",
        { name: cleanName },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      dispatch(setCurrentChannel(response.data.id))
      toast.success(t('toasts.channelCreated'))
      setShowAddChannel(false)
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken()
        removeUsername()
        window.location = '/login'
      } else {
        toast.error(t('errors.channelCreate'))
      }
      throw err
    }
  }

  const handleRemoveChannel = async (channelId) => {
    try {
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(t('toasts.channelDeleted'))
      setShowRemoveChannel(null)
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken()
        removeUsername()
        window.location = '/login'
      } else {
        toast.error(t('errors.channelDelete'))
      }
      throw err
    }
  }

  const handleRenameChannel = async (channelId, newName) => {
    try {
      const cleanName = profanity.clean(newName)

      await axios.patch(`/api/v1/channels/${channelId}`,
        { name: cleanName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(t('toasts.channelRenamed'))
      setShowRenameChannel(null)
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken()
        removeUsername()
        window.location = '/login'
      } else {
        toast.error(t('errors.channelRename'))
      }
      throw err
    }
  }

  const currentMessages = messages.filter(
    (m) => m.channelId === currentChannelId,
  )
  const currentChannel = channels.find((c) => c.id === currentChannelId)

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('chat.channels')}</b>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
              onClick={() => setShowAddChannel(true)}
            >
              <span>+</span>
            </button>
          </div>
          
          <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => (
              <li key={channel.id} className="nav-item w-100">
                {channel.name === "general" || channel.name === "random" ? (
                  <button
                    type="button"
                    className={`w-100 rounded-0 text-start btn ${channel.id === currentChannelId ? "btn-secondary" : ""}`}
                    onClick={() => dispatch(setCurrentChannel(channel.id))}
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                ) : ( 
                  <ChannelMenu 
                    channel={channel}
                    currentChannelId={currentChannelId}
                    onSwitchChannel={(id) => dispatch(setCurrentChannel(id))}
                    onShowRemove={() => setShowRemoveChannel(channel)}
                    onShowRename={() => setShowRenameChannel(channel)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {currentChannel?.name}</b>
              </p>
              <span className="text-muted">
                {currentMessages.length}{" "}
                {currentMessages.length === 1 ? t('chat.messages_one') : t('chat.messages_many')}
              </span>
            </div>

            <div className="chat-messages overflow-auto px-5">
              {currentMessages.map((msg) => (
                <div key={msg.id} className="text-break mb-2">
                  <b>{msg.username}:</b> {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-auto px-5 py-3">
              <form onSubmit={handleSendMessage} noValidate className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input
                    ref={inputRef}
                    name="body"
                    aria-label={t('chat.newMessage')}
                    placeholder={t('chat.messagePlaceholder')}
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
                    {t('chat.send')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showAddChannel && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <AddChannelModal 
              channelNames={channelNames}
              onAddChannel={handleAddChannel}
              onClose={() => setShowAddChannel(false)}
            />
          </div>
        </div>
      )}

      {showRemoveChannel && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <RemoveChannelModal 
              channel={showRemoveChannel}
              onClose={() => setShowRemoveChannel(null)}
              onRemove={handleRemoveChannel}
            />
          </div>
        </div>
      )}

      {showRenameChannel && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <RenameChannelModal 
              channel={showRenameChannel}
              onClose={() => setShowRenameChannel(null)}
              onRename={handleRenameChannel}
              channelNames={channelNames}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage
