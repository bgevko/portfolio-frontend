
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl } from '../config';

// hooks
import { useNotification } from './useNotification';
import { useShellCommands } from './useShellCommands';

// redux
import { enterLoggedIn, setUsername, enterIsAdmin, exitIsAdmin } from '../slices/appSlice';

const useLogin = () => {

  const dispatch = useDispatch();
  const shellState = useSelector((state) => state.shell);
  
  const { error, confirm } = useNotification();
  const { enterCommandProcessingMode, exitCommandProcessingMode, inputClear, setCaretPosToStart, appendHistory, setInputPrefix, setProcessingMessage, exitHiddenInputMode } = useShellCommands();

  const log_in = async (username, password) => {
    const userInfo = { username, password }
    dispatch(enterCommandProcessingMode())
    dispatch(setProcessingMessage('Authenticating...'))

    // set a timeout timer to stop processing if nothing happens after 30 seconds
    const timeoutTimer = setTimeout(() => {
      dispatch(exitCommandProcessingMode())
      dispatch(exitHiddenInputMode())
      dispatch(inputClear())
      dispatch(setCaretPosToStart())
      dispatch(appendHistory('Login timed out', shellState.invalidColor))
      dispatch(setInputPrefix('guest: '))
      return
    }, 30000)

    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })

    const loginData = await loginResponse.json()
    clearTimeout(timeoutTimer)
    dispatch(exitCommandProcessingMode())
    dispatch(exitHiddenInputMode())
    dispatch(inputClear())
    dispatch(setCaretPosToStart())

    if (loginResponse.ok) {
      dispatch(setInputPrefix(`${loginData.username}: `))
      dispatch(appendHistory(loginData.message, shellState.commandSuccessColor))
      localStorage.setItem('token', loginData.token)
      completeLogin(loginData)
    } else {
      dispatch(setInputPrefix('guest: '))
      dispatch(appendHistory(loginData.error, shellState.invalidColor))
    }
  }

  const checkLogin = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const tokenValid = await fetch(`${baseUrl}/login/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (tokenValid.ok) {
          const loginData = await tokenValid.json()
          completeLogin(loginData)
        } else {
          log_out()
        }
      } catch (err) {
        error('Error connecting to the server')
      }
    }
  }

  const completeLogin = (loginData) => {
    dispatch(enterLoggedIn())
    dispatch(setUsername(loginData.username))
    confirm(`Logged in as ${loginData.username}, rights: ${loginData.isAdmin ? 'admin' : 'user'}`)
    loginData.isAdmin ? dispatch(enterIsAdmin()) : dispatch(exitIsAdmin())
  }

  const log_out = () => {
    // TODO
  }

  return { checkLogin };
}

export { useLogin };