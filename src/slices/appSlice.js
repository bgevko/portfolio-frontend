
import { createSlice, createSelector } from '@reduxjs/toolkit'

// Create the slice
const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoggedIn: false,
    username: '',
    errorMessage: '',
    errorActive: false,
    errorTimeout: 4000,
    confirmMessage: '',
    confirmActive: false,
    confirmTimeout: 3000,
    dialogOpen: false,
    dialogTitle: '',
    dialogMessage: '',
    dialogStateOptions: { CONFIRM: 'CONFIRM', CANCEL: 'CANCEL', CLOSED: 'CLOSED' },
    dialogState: 'CLOSED',

  },
  reducers: {
    enterLoggedIn: (state) => {
      state.isLoggedIn = true
    },
    exitLoggedIn: (state) => {
      state.isLoggedIn = false
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload
    },
    enterErrorActive: (state) => {
      state.errorActive = true
    },
    exitErrorActive: (state) => {
      state.errorActive = false
    },
    setConfirmMessage: (state, action) => {
      state.confirmMessage = action.payload
    },
    enterConfirmActive: (state) => {
      state.confirmActive = true
    },
    exitConfirmActive: (state) => {
      state.confirmActive = false
    },
    openDialog: (state) => {
      state.dialogOpen = true
    },
    closeDialog: (state) => {
      state.dialogOpen = false
    },
    setDialogTitle: (state, action) => {
      state.dialogTitle = action.payload
    },
    setDialogMessage: (state, action) => {
      state.dialogMessage = action.payload
    },
    setDialogConfirmed: (state) => {
      state.dialogState = state.dialogStateOptions.CONFIRM
    },
    setDialogCancelled: (state) => {
      state.dialogState = state.dialogStateOptions.CANCEL
    },
    setDialogClosed: (state) => {
      state.dialogState = state.dialogStateOptions.CLOSED
    },
  },
})

// Create selectors
export const appSelector = createSelector(state => state.app, app => app)

// Export the actions
export const { enterLoggedIn, exitLoggedIn, setUsername, setErrorMessage, enterErrorActive, exitErrorActive, setConfirmMessage, enterConfirmActive, exitConfirmActive, scrollToTop, setDialogTitle, setDialogMessage, setDialogConfirmed, setDialogCancelled, setDialogClosed, openDialog, closeDialog } = appSlice.actions

// Export the reducer
export default appSlice.reducer
