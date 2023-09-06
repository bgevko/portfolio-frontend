
import { createSlice, createSelector } from '@reduxjs/toolkit'
import command from 'nodemon/lib/config/command'

// Create the slice
const shellSlice = createSlice({
  name: 'shell',
  initialState: {
    visible: false,
    shellWidth: 857,
    shellHeight: 300,
    validColor: 'green',
    invalidColor: 'red',
    argColor: 'yellow',
    inputPrefixColor: 'blue',
    commandSuccessColor: 'white',
    historyColor: 'green',
    inputPrefix: 'guest: ',
    input: [],
    usernameInput: '',
    passwordInput: '',
    colorMap: [],
    argMode: false,
    commandPrefix: '',
    focused: false,
    caretIdle: true,
    caretPos: 0,
    caretHidden: false,
    history: [],
    commandHistory: [],
    commandIndex: 0,
    commandProcessing: false,
    processingMessage: 'Processing...',
    loginProcessing: false,
    hiddenInputState: false,
  },
  reducers: {
    showShell: (state) => {
      state.visible = true
    },
    hideShell: (state) => {
      state.visible = false
    },
    observeShellWidth: (state, action) => {
      state.shellWidth = action.payload
    },
    observeShellHeight: (state, action) => {
      state.shellHeight = action.payload
    },
    setUsernameInput: (state, action) => {
      state.usernameInput = action.payload
    },
    clearUsernameInput: (state) => {
      state.usernameInput = ''
    },
    addPasswordChar(state, action) {
      state.passwordInput += action.payload
    },
    removePasswordChar(state) {
      state.passwordInput = state.passwordInput.slice(0, state.passwordInput.length - 1)
    },
    clearPasswordInput(state) {
      state.passwordInput = ''
    },
    setInputPrefix: (state, action) => {
      state.inputPrefix = action.payload
    },
    appendInputPrefix: (state, action) => {
      state.inputPrefix += action.payload
    },
    setInput: (state, action) => {
      state.input = action.payload.split('')
    },
    appendInput: (state, action) => {
      state.input.push(action.payload)
    },
    setInputToPreviousCommand: (state) => {
      if (state.commandHistory.length > 0 && state.commandIndex > 0) {
        const command = state.commandHistory[state.commandIndex - 1]
        state.input = command.split('')
      }
    },
    setInputToNextCommand: (state) => {
      if (state.commandHistory.length > 0 && state.commandIndex < state.commandHistory.length - 1) {
        const command = state.commandHistory[state.commandIndex + 1]
        state.input = command.split('')
      } else if (state.commandIndex === state.commandHistory.length - 1) {
        state.input = []
      }
    },
    inputClear: (state) => {
      state.input = []
    },
    removeInputAtCaretPos: (state) => {
      if (state.input.length > 0 && state.caretPos > 0) {
        state.input.splice(state.caretPos - 1, 1)
      }
    },
    insertInputAtCaretPos: (state, action) => {
      state.input.splice(state.caretPos, 0, action.payload)
    },
    setColorMapValid: (state) => {
      state.colorMap = state.input.map(() => state.validColor)
    },
    setColorMapInvalid: (state) => {
      state.colorMap = state.input.map(() => state.invalidColor)
    },
    setColorMapArg: (state) => {
      // set command color from index 0 to index of first space, and arg color from index of first space to end
      state.colorMap = [...state.input.slice(0, state.input.indexOf(' ')).map(() => state.commandColor), ...state.input.slice(state.input.indexOf(' ')).map(() => state.argColor)]
    },
    removeColorMapAtCaretPos: (state) => {
      if (state.colorMap.length > 0 && state.caretPos > 0) {
        state.colorMap.splice(state.caretPos - 1, 1)
      }
    },
    insertColorMapAtCaretPos: (state, action) => {
      state.colorMap.splice(state.caretPos, 0, action.payload)
    },
    clearColorMap: (state) => {
      state.colorMap = []
    },
    setArgMode: (state) => {
      // make sure input is not empty
      if (state.input.length === 0) {
        state.argMode = false
      }
      // if input has no spaces
      else if (state.input.join('').indexOf(' ') === -1) {
        state.argMode = false
      }
      // if input has spaces
      else {
        state.argMode = true
      }
    },
    setCommandPrefix: (state) => {
      if (state.input.length === 0) {
        state.commandPrefix = ''
      } else {
        state.commandPrefix = state.input.slice(0, state.input.indexOf(' ')).join('')
      }
    },
    enterFocus: (state) => {
      state.focused = true
    },
    exitFocus: (state) => {
      state.focused = false
    },
    enterIdle: (state) => {
      state.caretIdle = true
    },
    exitIdle: (state) => {
      state.caretIdle = false
    },
    setCaretPosToEnd: (state) => {
      state.caretPos = state.input.length
    },
    setCaretPosToStart: (state) => {
      state.caretPos = 0
    },
    incrementCaret: (state) => {
      if (state.caretPos < state.input.length) {
        state.caretPos += 1
      }
    },
    decrementCaret: (state) => {
      if (state.caretPos > 0) {
        state.caretPos -= 1
      }
    },
    hideCaret: (state) => {
      state.caretHidden = true
    },
    showCaret: (state) => {
      state.caretHidden = false
    },
    appendHistory: {
      reducer: (state, action) => {
        let color = state.historyColor
        if (action.payload.color) {
          color = action.payload.color
        }
        state.history.push({ text: action.payload.text, color })
      },
      prepare: (text, color) => {
        return { payload: { text, color }}
      }
    },
    clearHistory: (state) => {
      state.history = []
    },
    setCommandHistory: (state, action) => {
      state.commandHistory = action.payload
    },
    appendCommandHistory: (state, action) => {
      state.commandHistory.push(action.payload)
    },
    updateCommandIndex: (state) => {
      state.commandIndex = state.commandHistory.length
    },
    incrementCommandIndex: (state) => {
      if (state.commandIndex < state.commandHistory.length - 1) {
        state.commandIndex += 1
      }
    },
    decrementCommandIndex: (state) => {
      if (state.commandIndex > 0) {
        state.commandIndex -= 1
      }
    },
    enterCommandProcessingMode: (state) => {
      state.commandProcessing = true
    },
    exitCommandProcessingMode: (state) => {
      state.commandProcessing = false
    },
    setProcessingMessage: (state, action) => {
      state.processingMessage = action.payload
    },
    enterHiddenInputMode: (state) => {
      state.hiddenInputState = true
    },
    exitHiddenInputMode: (state) => {
      state.hiddenInputState = false
    },
    enterLoginProcessingMode: (state) => {
      state.loginProcessing = true
    },
    exitLoginProcessingMode: (state) => {
      state.loginProcessing = false
    }
  },
})

// Create selectors
export const shellSelector = createSelector(state => state.shell, shell => shell)

// Export the actions
export const { showShell, hideShell, observeShellWidth, observeShellHeight, setInputPrefix, appendInputPrefix, setInput, setInputToPreviousCommand, setInputToNextCommand, inputClear, removeInputAtCaretPos, insertInputAtCaretPos, setColorMapValid, setColorMapInvalid, setColorMapArg, removeColorMapAtCaretPos, insertColorMapAtCaretPos, clearColorMap, setArgMode, setCommandPrefix, enterFocus, exitFocus, enterIdle, exitIdle, setCaretPosToEnd, setCaretPosToStart, incrementCaret, decrementCaret, appendHistory, setCommandHistory, appendCommandHistory, updateCommandIndex, incrementCommandIndex, decrementCommandIndex, enterCommandProcessingMode, exitCommandProcessingMode, enterHiddenInputMode, exitHiddenInputMode, clearHistory, setUsernameInput, addPasswordChar, removePasswordChar, enterLoginProcessingMode, exitLoginProcessingMode, hideCaret, showCaret, appendInput, setProcessingMessage, clearUsernameInput, clearPasswordInput } = shellSlice.actions

// Export the reducer
export default shellSlice.reducer
