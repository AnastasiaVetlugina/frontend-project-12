import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { io } from "socket.io-client"
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

const ChatPage = () => {
  const dispatch = useDispatch()
  const channels = useSelector(selectChannels)
  const channelNames = channels.map((ch) => ch.name)
  const currentChannelId = useSelector(selectCurrentChannelId)
  const messages = useSelector(selectMessages)

  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [showAddChannel, setShowAddChannel] = useState(false)
  const [showRemoveChannel, setShowRemoveChannel] = useState(null)
  const [showRenameChannel, setShowRenameChannel] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (showAddChannel || showRemoveChannel || showRenameChannel) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
    
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [showAddChannel, showRemoveChannel, showRenameChannel])

  useEffect(() => {
    const socket = io({ auth: { token } })

    const fetchData = async () => {
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
        console.error("Ошибка загрузки:", error)
      }
    }

    fetchData()

    socket.on("newMessage", (message) => {
      dispatch(addMessage(message))
    })

    socket.on("newChannel", (channel) => {
      dispatch(addChannel(channel))
    })

    socket.on("removeChannel", ({ id }) => {
      dispatch(removeChannel(id))
      const state = store.getState()
      if (state.channels.currentChannelId === id) {
        const general = state.channels.channels.find(ch => ch.name === 'general')
        if (general) dispatch(setCurrentChannel(general.id))
      }
    })

    socket.on("renameChannel", ({ id, name }) => {
      dispatch(renameChannel({ id, name }))
    })

    return () => socket.disconnect()
  }, [dispatch, token])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)
    try {
      await axios.post(
        "/api/v1/messages",
        { text: newMessage, channelId: currentChannelId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setNewMessage("")
    } catch (err) {
      console.error("Ошибка отправки:", err)
    } finally {
      setSending(false)
    }
  }

  const handleAddChannel = async (channelName) => {
    try {
      const response = await axios.post(
        "/api/v1/channels",
        { name: channelName },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      dispatch(setCurrentChannel(response.data.id))
      setShowAddChannel(false)
    } catch (err) {
      console.error("Ошибка создания канала:", err)
      throw err
    }
  }

  const handleRemoveChannel = async (channelId) => {
    try {
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowRemoveChannel(null)
    } catch (err) {
      console.error("Ошибка удаления:", err)
      throw err
    }
  }

  const handleRenameChannel = async (channelId, newName) => {
    try {
      await axios.patch(`/api/v1/channels/${channelId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowRenameChannel(null)
    } catch (err) {
      console.error("Ошибка переименования:", err)
      throw err
    }
  }

  const currentMessages = messages.filter(
    (m) => m.channelId === currentChannelId,
  )
  const currentChannel = channels.find((c) => c.id === currentChannelId)

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
              onClick={() => setShowAddChannel(true)}
            >
              <span>+</span>
            </button>
          </div>
          
          <ul
            id="channels-box"
            className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          >
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
                {currentMessages.length === 1 ? "сообщение" : "сообщений"}
              </span>
            </div>

            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {currentMessages.map((msg) => (
                <div key={msg.id} className="text-break mb-2">
                  <b>{msg.username}:</b> {msg.text}
                </div>
              ))}
            </div>

            <div className="mt-auto px-5 py-3">
              <form
                onSubmit={handleSendMessage}
                noValidate
                className="py-1 border rounded-2"
              >
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

      {showAddChannel && (
        <div 
          className="modal show" 
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} 
          tabIndex="-1"
        >
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
        <div 
          className="modal show" 
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} 
          tabIndex="-1"
        >
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
        <div 
          className="modal show" 
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} 
          tabIndex="-1"
        >
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
