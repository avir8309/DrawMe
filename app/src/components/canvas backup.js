import React, { useState, useEffect, useRef } from 'react';

const DrawCanvas = ({ brushColor, brushSize }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [rectangleMode, setRectangleMode] = useState(false);
  const [startRectPos, setStartRectPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const getCanvasPosition = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    

    const draw = (e) => {
      if (!canvas) return;
      if(!isDrawing)return;
      // e.preventDefault();
      // e.stopPropogation();

      const x = getCanvasPosition(e).x;
      const y = getCanvasPosition(e).y;
      const rectheight=y-startRectPos.y;
      const rectwidth=x-startRectPos.x;

      if (rectangleMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.strokeRect(
          startRectPos.x,
          startRectPos.y,
          x - startRectPos.x,
          y - startRectPos.y
        );
      } else if (isDrawing) {
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(prevPos.x, prevPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        setPrevPos({ x, y });
      }
    };
    const handleMouseDown = (e) => {
        if (rectangleMode) {
          const startPos = getCanvasPosition(e);
          setStartRectPos(startPos);
          
          setIsDrawing(true);
        } else {
          setIsDrawing(true);
          setPrevPos(getCanvasPosition(e));
        }
      };
    
      
    
      const handleMouseUp = () => {
        setIsDrawing(false);
        setRectangleMode(false);
      };
    

    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, [brushColor, brushSize, isDrawing, prevPos, rectangleMode]);

  const handleRectangleMode = () => {
    setRectangleMode(!rectangleMode);
  };

  return (
    <div>
      <canvas
        width={600}
        height={600}
        style={{ border: '1px solid black' }}
        ref={canvasRef}
      />
      <button onClick={handleRectangleMode}>
        {rectangleMode ? 'Exit Rectangle Mode' : 'Enter Rectangle Mode'}
      </button>
    </div>
  );
};

export default DrawCanvas;
