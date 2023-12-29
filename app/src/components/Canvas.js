import React, { useState, useEffect, useRef } from 'react';
import Color from './Color';
import { Socket } from 'socket.io-client';
import ChatPage from './ChatPage';

const DrawCanvas = ({ brushColor, brushSize,onColorChange,onEraseChange,onIncreaseChange,onDecreaseChange ,socket}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [rectangleMode, setRectangleMode] = useState(false);
  const [circleMode, setCircleMode] = useState(false);
  const [startRectPos, setStartRectPos] = useState({ x: 0, y: 0 });
  const [startCirclePos, setStartCirclePos] = useState({ x: 0, y: 0 });
  const onSaveChange=()=>{
    const canvas = document.getElementById('myCanvas');
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'canvas_image.png';
  link.click();
  }
  
  console.log(brushSize);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    console.log("useeffect ke andar");
    ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;

    const getCanvasPosition = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const drawrectangle=(sx,sy,ex,ey)=>{
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeRect(
          sx,
          sy,
          ex - sx,
          ey - sy
        );


    }
    const drawcircle=(sx,sy,ex,ey)=>{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = Math.sqrt(
          Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2)
        );
       
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    const drawpencil=(sx,sy,ex,ey)=>{
      
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      

    }

    const draw = (e) => {
      const x = getCanvasPosition(e).x;
      const y = getCanvasPosition(e).y;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      

      if (rectangleMode && isDrawing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.strokeRect(
          startRectPos.x,
          startRectPos.y,
          x - startRectPos.x,
          y - startRectPos.y
        );
        socket.emit('drawrectangle',{sx:startRectPos.x,sy:startRectPos.y,ex:x,ey:y,room:localStorage.getItem('room')});
      } else if (circleMode && isDrawing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = Math.sqrt(
          Math.pow(x - startCirclePos.x, 2) + Math.pow(y - startCirclePos.y, 2)
        );
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.arc(startCirclePos.x, startCirclePos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        socket.emit('drawcircle',{sx:startCirclePos.x,sy:startCirclePos.y,ex:x,ey:y,room:localStorage.getItem('room')});
      }
      else if(isDrawing){
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(prevPos.x, prevPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        socket.emit('drawpencil',{sx:prevPos.x,sy:prevPos.y,ex:x,ey:y,room:localStorage.getItem('room')});
        setPrevPos({ x, y });
        
      }
    };
  
    const handleMouseDown = (e) => {
      if (rectangleMode) {
        const startPos = getCanvasPosition(e);
        setStartRectPos(startPos);
        setIsDrawing(true);
      } else if (circleMode) {
        const startPos = getCanvasPosition(e);
        setStartCirclePos(startPos);
        setIsDrawing(true);
      }
      else{
        setIsDrawing(true);
          setPrevPos(getCanvasPosition(e));
      }
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setCircleMode(false);
      setRectangleMode(false);
    };
    const handledrawrectangle=(path)=>{
      if(path.room===localStorage.getItem('room')){
        drawrectangle(path.sx,path.sy,path.ex,path.ey);

      }
      
    }
    const handledrawcircle=(path)=>{
      if(path.room===localStorage.getItem('room')){
        drawcircle(path.sx,path.sy,path.ex,path.ey);

      }
      
    }
    const handledrawpencil=(path)=>{
      if(path.room===localStorage.getItem('room')){
        drawpencil(path.sx,path.sy,path.ex,path.ey);

      }
      

    }
    

    if (canvas) {

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
    }
   
    socket.on('drawrectangle',handledrawrectangle);
      socket.on('drawcircle',handledrawcircle);
      socket.on('drawpencil',handledrawpencil);

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, [brushColor, brushSize, isDrawing, prevPos, rectangleMode, circleMode]);

  const handleRectangleMode = () => {
    setRectangleMode(!rectangleMode);
    setCircleMode(false);
  };

  const handleCircleMode = () => {
    setCircleMode(!circleMode);
    setRectangleMode(false);
  };

  return (
    <div className='main-page'>
      <div  className='main-page-div1'>
      <Color onColorChange={onColorChange} onEraseChange={onEraseChange} onIncreaseChange={onIncreaseChange} onDecreaseChange={onDecreaseChange} onSaveChange={onSaveChange} socket={socket}/>
      <canvas id="myCanvas"
        width={900}
        height={500}
        style={{ border: '1px solid black' }}
        ref={canvasRef}
      />
      <button onClick={handleRectangleMode} className='circle'>
        {rectangleMode ? 'Exit Rectangle' : 'Enter Rectangle'}
      </button>
      <button onClick={handleCircleMode} className='circle'>
        {circleMode ? 'Exit Circle' : 'Enter Circle'}
      </button>

      </div>
      <div>
      <ChatPage className='chat-page' socket={socket}/>

      </div>
      
      
    </div>
  );
};

export default DrawCanvas;
