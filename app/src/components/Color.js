import React from 'react';
import { Icon } from '@iconify/react';


const Color = ({ onColorChange,onEraseChange,onIncreaseChange,onDecreaseChange ,onSaveChange,socket}) => {
  const handler = (color) => {
    onColorChange(color); // Pass the color directly instead of color.hex
    socket.emit('colorchange',color);
    
  };
  const erasehandler=(color)=>{
    onEraseChange(color);
    socket.emit('eraserchange',color);
  }
  const increaseHandler=()=>{
    console.log("inside handler");
    onIncreaseChange();
    socket.emit('increasechange');
  }
  const decreaseHandler=()=>{
    onDecreaseChange();
    socket.emit('decreasechange');
  }
  const handlecolorchange=(color)=>{
    onColorChange(color);
  }
  const handleeraserchange=(color)=>{
    onEraseChange(color);
  }
  const handleincreasechange=()=>{
    onIncreaseChange();
  }
  const handledecreasechange=()=>{
    onDecreaseChange();
  }
  const saveHandler = () => {
    
    onSaveChange();
  };
  socket.on('colorchange',handlecolorchange);
  socket.on('eraserchange',handleeraserchange);
  socket.on('increasechange',handleincreasechange);
  socket.on('decreasechange',handledecreasechange);
  const colors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#000000', // Black
    '#FFA500', // Orange
    '#800080', // Purple
    '#008080', // Teal
    '#FFC0CB', // Pink (Added color)
    // Other colors without white
  ];
  
  
  // Style for square buttons
  const buttonStyle = {
    width: '50px',
    height: '50px',
    margin: '5px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '50%', // Apply border radius for rounded buttons
  };
  

  // Map through the colors array to create square buttons
  return (
    <div style={{ display: 'flex' }}>
      {colors.map((color, index) => (
        <button
          onClick={() => handler(color)}
          key={index}
          style={{ ...buttonStyle, backgroundColor: color }}
        ></button>
      ))}
      <button style={buttonStyle} onClick={()=>erasehandler('#FFFFFF')}><Icon icon="mdi:eraser" /></button>
      <button style={buttonStyle} onClick={()=>increaseHandler()}><Icon icon="mdi:plus-outline" /></button>
      <button style={buttonStyle} onClick={()=>decreaseHandler()}><Icon icon="fluent:subtract-12-filled" /></button>
      <button style={buttonStyle} onClick={()=>saveHandler()}><Icon icon="mdi:download-outline" /></button>
    </div>
  );
};

export default Color;
