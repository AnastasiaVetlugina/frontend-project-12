import { createSlice } from "@reduxjs/toolkit"

const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    setChannels(state, action) {
      state.channels = action.payload
    },
    setCurrentChannel(state, action) {
      state.currentChannelId = action.payload
    },
    addChannel(state, action) {
      state.channels.push(action.payload)
    },
    removeChannel(state, action) {
      state.channels = state.channels.filter(
        (channel) => channel.id !== action.payload,
      )
    },
    renameChannel(state, action) {
      const { id, name } = action.payload
      const channel = state.channels.find((ch) => ch.id === id)
      if (channel) {
        channel.name = name
      }
    },
  },
})

export const { setChannels, setCurrentChannel, addChannel, removeChannel, renameChannel } = channelsSlice.actions

export const selectChannels = (state) => state.channels.channels
export const selectCurrentChannelId = (state) => state.channels.currentChannelId

export default channelsSlice.reducer
