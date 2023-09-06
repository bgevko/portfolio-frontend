import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useSelector, useDispatch } from 'react-redux';
import { observeShellWidth, observeShellHeight } from '../slices/shellSlice';
function ResizableWindow({
  style,
  id,
  className,
  handleWidth,
  zValue,
  topDisabled,
  rightDisabled,
  bottomDisabled,
  leftDisabled,
  children
}) {
  const [draggingTop, setDraggingTop] = useState(false)
  const [draggingRight, setDraggingRight] = useState(false)
  const [draggingBottom, setDraggingBottom] = useState(false)
  const [draggingLeft, setDraggingLeft] = useState(false)
  const [initialMousePos, setInitialMousePos] = useState(0)

  const windowRef = useRef(null)
  const state = useSelector((state) => state.shell)
  const dispatch = useDispatch()
  const resizeHandleWidth = handleWidth || 10
  const zIndex = zValue || 2
  
  const windowStyle = {
    ...style,
    width: `${state.shellWidth}px`,
    height: `${state.shellHeight}px`,
    position: 'absolute',
    zIndex: `${zIndex}`
  }

  const topBar = {
    width: '100%',
    height: `${resizeHandleWidth}px`,
    position: 'absolute',
    top: `-${resizeHandleWidth / 1.5}px`,
    zIndex: `${zIndex + 1}`
  }

  const dragArea = {
    width: '100%',
    height: '30px',
    position: 'absolute',
    top: '-4px'
  }

  const rightBar = {
    width: `${resizeHandleWidth}px`,
    height: '100%',
    position: 'absolute',
    right: `-${resizeHandleWidth / 2}px`,
    zIndex: `${zIndex + 1}`
  }

  const bottomBar = {
    width: '100%',
    height: `${resizeHandleWidth}px`,
    position: 'absolute',
    bottom: `-${resizeHandleWidth / 2}px`,
    zIndex: `${zIndex + 1}`
  }

  const leftBar = {
    width: `${resizeHandleWidth}px`,
    height: '100%',
    position: 'absolute',
    left: `-${resizeHandleWidth / 2}px`,
    zIndex: `${zIndex + 1}`
  }

  const disableDragging = () => {
    setDraggingTop(false)
    setDraggingRight(false)
    setDraggingBottom(false)
    setDraggingLeft(false)
  }

  useEffect(() => {
    const handleMouseMoveTop = (e) => {
      if (draggingTop && !topDisabled) {
        const heightDiff = initialMousePos - e.clientY
        const newHeight = windowRef.current.offsetHeight + heightDiff
        windowRef.current.style.height = `${newHeight}px`
        windowRef.current.style.top = `${windowRef.current.offsetTop - heightDiff}px`
        setInitialMousePos(e.clientY)
        dispatch(observeShellHeight(newHeight))
      }
    }

    const handleMouseMoveRight = (e) => {
      if (draggingRight && !rightDisabled) {
        const widthDiff = e.clientX - initialMousePos
        const newWidth = windowRef.current.offsetWidth + widthDiff
        windowRef.current.style.width = `${newWidth}px`
        setInitialMousePos(e.clientX)
        dispatch(observeShellWidth(newWidth))
      }
    }

    const handleMouseMoveBottom = (e) => {
      if (draggingBottom && !bottomDisabled) {
        const heightDiff = e.clientY - initialMousePos
        const newHeight = windowRef.current.offsetHeight + heightDiff
        windowRef.current.style.height = `${newHeight}px`
        setInitialMousePos(e.clientY)
        dispatch(observeShellHeight(newHeight))
      }
    }

    const handleMouseMoveLeft = (e) => {
      if (draggingLeft && !leftDisabled) {
        const widthDiff = initialMousePos - e.clientX
        const newWidth = windowRef.current.offsetWidth + widthDiff
        windowRef.current.style.width = `${newWidth}px`
        windowRef.current.style.left = `${windowRef.current.offsetLeft - widthDiff}px`
        setInitialMousePos(e.clientX)
        dispatch(observeShellWidth(newWidth))
      }
    }

    document.addEventListener('mousemove', handleMouseMoveTop);
    document.addEventListener('mousemove', handleMouseMoveRight);
    document.addEventListener('mousemove', handleMouseMoveBottom);
    document.addEventListener('mousemove', handleMouseMoveLeft);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveTop);
      document.removeEventListener('mousemove', handleMouseMoveRight);
      document.removeEventListener('mousemove', handleMouseMoveBottom);
      document.removeEventListener('mousemove', handleMouseMoveLeft);
    }

  }, [draggingTop, initialMousePos])

  useEffect(() => {

    // disable dragging when mouse is released
    const handleMouseUp = () => disableDragging();
    document.addEventListener('mouseup', handleMouseUp);
  
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // disable text selection while dragging
  useEffect(() => {
    const handleSelectStart = (e) => e.preventDefault()
    if (draggingTop || draggingRight || draggingBottom || draggingLeft) {
      document.addEventListener('selectstart', handleSelectStart)
    } else {
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [draggingTop, draggingRight, draggingBottom, draggingLeft])

  return (
    <Draggable
      handle='#drag-area'
    >
    <div id={id} className={`resizable-window ${className}`} ref={windowRef} style={windowStyle}>

      <div id='drag-area' style={dragArea}></div>
      <div 
        className={`resizable-window-top-bar ${topDisabled ? 'resize-disabled' : ''}`}
        onMouseDown={(e) =>{ setDraggingTop(true); setInitialMousePos(e.clientY) }}
        style={topBar}>
      </div>

      <div 
        className={`resizable-window-right-bar ${rightDisabled ? 'resize-disabled' : ''}`}
        onMouseDown={(e) =>{ setDraggingRight(true); setInitialMousePos(e.clientX) }}
        style={rightBar}>
      </div>

      <div
        className={`resizable-window-bottom-bar ${bottomDisabled ? 'resize-disabled' : ''}`}
        onMouseDown={(e) =>{ setDraggingBottom(true); setInitialMousePos(e.clientY) }}
        style={bottomBar}>
      </div>

      <div
        className={`resizable-window-left-bar ${topDisabled ? 'resize-disabled' : ''}`}
        onMouseDown={(e) =>{ setDraggingLeft(true); setInitialMousePos(e.clientX) }}
        style={leftBar}>
      </div>

      {children}
    </div>
    </Draggable>
  );
}

export default ResizableWindow;


