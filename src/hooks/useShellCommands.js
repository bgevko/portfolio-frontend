import { useNavigate } from 'react-router-dom';
import Trie from '../utils/Trie';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { setUsernameInput, setInputToPreviousCommand, setInputToNextCommand, inputClear, removeInputAtCaretPos, insertInputAtCaretPos, removeColorMapAtCaretPos, insertColorMapAtCaretPos, clearColorMap,  setCaretPosToEnd, setCaretPosToStart, incrementCaret, decrementCaret, appendHistory, appendCommandHistory, clearHistory, decrementCommandIndex, incrementCommandIndex, enterCommandProcessingMode, enterHiddenInputMode, exitHiddenInputMode, setInputPrefix, addPasswordChar, removePasswordChar, enterLoginProcessingMode, exitCommandProcessingMode, setProcessingMessage, setInput, clearPasswordInput, clearUsernameInput, shellSelector} from '../slices/shellSlice'

export const useShellCommands = () => {
  const navigate = useNavigate();

  const state = useSelector(shellSelector)
  const dispatch = useDispatch()

  // create a commands eNum
  const commands = {
    HELP: 'help',
    CLEAR: 'clear',
    LOGIN: 'login',
    LOGOUT: 'logout',
    HOME: 'home',
    BLOG: 'blog',
    CONTACT: 'contact',
    ORDER: 'order',
    GALLERY: 'gallery',
  };

  // create a trie to store the commands
  const commandTrie = new Trie();
  Object.values(commands).forEach((command) => commandTrie.insert(command));

  const processInput = (e, shellRef) => {
    // Cmd + Backspace deletes entire line
    if (e.metaKey && e.key === "Backspace" && !state.hiddenInputState) {
      dispatch(inputClear())
      dispatch(setCaretPosToStart())
      dispatch(clearColorMap())
    }

    // Option + left arrow moves caret to beginning of line
    else if (e.altKey && e.key === "ArrowLeft" && !state.hiddenInputState) {
      dispatch(setCaretPosToStart())
    }

    // Option + right arrow moves caret to end of line
    else if (e.altKey && e.key === "ArrowRight" && !state.hiddenInputState) {
      dispatch(setCaretPosToEnd())
      shellRef.current.scrollTop = shellRef.current.scrollHeight
    }

    // Backspace in normal mode
    else if (e.key === "Backspace" && !e.metaKey && !e.altKey && !state.hiddenInputState) {
      if (state.input.length > 0) {
        dispatch(removeInputAtCaretPos())
        dispatch(decrementCaret())
        dispatch(removeColorMapAtCaretPos())
      }
      // Backspace in hidden input mode
    } else if (e.key === "Backspace" && !e.metaKey && !e.altKey && state.hiddenInputState) {
      dispatch(removePasswordChar())
    }

    // Command + k clears history
    else if (e.metaKey && e.key === "k" && !state.hiddenInputState) {
      dispatch(clearHistory())
    }

    // Handle normal input submit
    else if (e.key === "Enter" && !state.hiddenInputState) {
        const command = state.input.join('')
      if (command.trim().length === 0) {
        return
      }
      const output = processCommand(command)
      if (output) {
        dispatch(appendHistory(`$ ${output.text}`, output.color))
      }
      dispatch(appendCommandHistory(command))
      dispatch(inputClear())
      dispatch(setCaretPosToStart())
    }
    // Handle hidden input password submit
    else if (e.key === "Enter" && state.hiddenInputState && state.loginProcessing) {
      if (state.passwordInput.length > 0) {
        //TODO call some process login
      }
    }

    // Normal input
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !state.hiddenInputState) {
      dispatch(insertInputAtCaretPos(e.key))
      dispatch(incrementCaret())
      dispatch(insertColorMapAtCaretPos('red'))
    } 
    // Hidden input
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && state.hiddenInputState) {
      dispatch(addPasswordChar(e.key))
    }

    // Left arrow
    else if (e.keyCode === 37 && !e.metaKey && !e.altKey && !state.hiddenInputState) {
      dispatch(decrementCaret())
    }

    // Right arrow
    else if (e.keyCode === 39 && !e.metaKey && !e.altKey && !state.hiddenInputState) {
      dispatch(incrementCaret())
    }

    // Up arrow
    else if (e.keyCode === 38 && !e.metaKey && !e.altKey && !state.hiddenInputState) {
      // prevent scrolling behavior when pressing up arrow
      e.preventDefault()
      dispatch(setInputToPreviousCommand())
      dispatch(decrementCommandIndex())
      dispatch(setCaretPosToEnd())
    }

    // Down arrow
    else if (e.keyCode === 40 && !e.metaKey && !e.altKey && !state.hiddenInputState) {
      dispatch(setInputToNextCommand())
      dispatch(incrementCommandIndex())
      dispatch(setCaretPosToEnd())
    }
  }

  const output = (text, type) => {
    let color;
    switch (type) {
      case 'general':
        color = state.validColor;
        break;
      case 'error':
        color = state.invalidColor;
        break;
      case 'success':
        color = state.commandSuccessColor;
        break;
      default:
        color = state.validColor;
    }
    return { text, color };
  }

  const processCommand = (command) => {
    // split the command into command and arguments (seperated by the first space)
    const [commandName, ...args] = command.split(' ');
    switch (commandName) {
      case commands.HELP:
        // valid commands string
        const validCommands = Object.values(commands).join(', ');
        return output(`Valid commands: ${validCommands}`)
      case commands.CLEAR:
        // clear the shell
        dispatch(clearHistory())
        break;
      case commands.LOGIN:
        // if too many arguments
        if (args.length > 1) {
          return output('Too many arguments. Usage: login <username>', 'error');
        } else if (args.length === 0) {
          return output(`Not enough arguments. Usage: login <username>`, 'error');
        }

        const username = args[0];
        //TODO: login logic
        return output(`${command}`)
      case commands.LOGOUT:
        // handle logout logic
        return output('logout');
      case commands.HOME:
        navigate('/');
        return output('Navigated to the home page');
      case commands.BLOG:
        navigate('/blog');
        return output('Navigated to the blog page');
      case commands.CONTACT:
        navigate('/contact');
        return output('Navigated to the contact page');
      case commands.ORDER:
        navigate('/order');
        return output('Navigated to the order page');
      case commands.GALLERY:
        navigate('/gallery');
        return output('Navigated to the gallery page');
      default:
        return output(`Command not found: ${command}`, 'error');
    }
  };

  return { processCommand, processInput, commandTrie }
};
