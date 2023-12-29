import React, { useState, useEffect } from 'react';

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);
  console.log("chatbar");
  console.log(users);
  //filter data
  const people = users.filter((user) => {
    return user.room === localStorage.getItem('room');
  });
  
  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className="chat__sidebar">
    
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {people.map((user) => (
            
            <p key={user.socketID}>{user.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;