import React, { useContext } from 'react'
import "./App.css"
import va from "./assets/image.png"
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/UserContext";
import speakimg from "./assets/humanVoice.gif";
import aigif from "./assets/AiVoice.gif";
function App() {
  let { recognition, speaking, setSpeaking, prompt, setPrompt, response, setResponse }=useContext(datacontext)
  
  return(
    <div className='main'>
      <img src={va} alt="" id="Elena" />
      <span>
      Hello Kshitij i am Elena, your AI-Assistant
      </span>
      {!speaking?
      <button onClick={() => {
        setPrompt("listening...")
        setSpeaking(true)
        setResponse(false)
     recognition.start()
}}>Click here <CiMicrophoneOn /></button>
 : 
 <div className='response'> 
 {!response ?( 
 <img src={speakimg} alt="listening..." id="listening" />
 ) : (
 <img  src={aigif} alt="speaking..." id="speaking" />
 )}
  <p>{prompt}</p>
 </div>
}
    </div>
  )
}

export default App





