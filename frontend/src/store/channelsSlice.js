import { createSlice } from '@reduxjs/toolkit'

const channelsSlice = createSlice({
  name: 'channels',
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
  },
})

export const { setChannels, setCurrentChannel } = channelsSlice.actions

export const selectChannels = (state) => state.channels.channels
export const selectCurrentChannelId = (state) => state.channels.currentChannelId

export default channelsSlice.reducer
