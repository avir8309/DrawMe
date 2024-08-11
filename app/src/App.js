import React, { useEffect, useState } from 'react';
import DrawCanvas from './components/Canvas';
import Color from './components/Color';
import socketIO from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

const socket = socketIO.connect('draw-me-backend.vercel.app');

function App() {
  const [brushColor, setBrushColor] = useState('#000000'); // State to hold brush color
  const [brushsize,setbrushsize]=useState(2);
  const handleColorChange = (color) => {
    setBrushColor(color);
  };
  const handleincrease=()=>{
    console.log("inside handleincrease");
    
    setbrushsize(brushsize+1);
    console.log(brushsize);
    
    
  }
  const handledecrease=()=>{
    if(brushsize>2){
      setbrushsize(brushsize-1);
    }
  }
  useEffect(()=>{
    
  },[brushColor,brushsize]);

  return (
    <BrowserRouter>
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-row items-center">
        <Routes>
          <Route path="/" element={<Home socket={socket}/>}></Route>
          <Route path='/draw' element={<DrawCanvas brushColor={brushColor} brushSize={brushsize} onColorChange={handleColorChange} onEraseChange={handleColorChange} onIncreaseChange={handleincrease} onDecreaseChange={handledecrease} socket={socket}/>}></Route>

        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
