import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload
    },
  },
})

export const { setMessages } = messagesSlice.actions

export const selectMessages = (state) => state.messages.messages

export default messagesSlice.reducer
