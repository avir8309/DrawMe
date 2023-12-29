import react from 'react'
import { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';



//form banao
const Home=({socket})=>{
    const[name,setname]=useState('');
    const[room,setroom]=useState('');
    const navigate=useNavigate();

    const handlesubmit=(e)=>{
        e.preventDefault();
        localStorage.setItem('name',name);
        localStorage.setItem('room',room);
        console.log("submit kardiya");
        socket.emit('newUser',({name:name,room:room}));


        navigate("/draw");

        



    }


    return <div>
        
        <form onSubmit={handlesubmit} className='form-container'>
        <h1 className='heading'>Draw Me</h1>
            <div className='top'>
            <div className='inputbox'>
                <input type='text' placeholder='name' onChange={(e)=>setname(e.target.value)}/>
                

            </div>
            <div className='inputbox'>
            <input type='text' placeholder='room' onChange={(e)=>setroom(e.target.value)}/>
            </div>
            <div className='inputbox'>
            <button className='submit-button'>sign in</button>

            </div>
            </div>
            
            

        </form>
        
    </div>
}
export default Home;