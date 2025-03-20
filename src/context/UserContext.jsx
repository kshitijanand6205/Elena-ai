import React, { createContext, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");
  const [response, setResponse] = useState(false);

  // Speak Function - Controls AI speech
  function speak(text) {
    const cleanedText = text.replace(/\*/g, "").trim();
    const text_speak = new SpeechSynthesisUtterance(cleanedText);

    text_speak.volume = 1;
    text_speak.rate = 1.2; // Slightly faster speech for clarity
    text_speak.pitch = 1;
    text_speak.lang = "en-GB";
    

    console.log("Speaking:", cleanedText);

    text_speak.onend = () => {
      console.log("AI finished speaking.");
      setTimeout(() => {
        setSpeaking(false);
        setPrompt("Listening..."); // Reset UI after speaking
        setResponse(false);
      }, 500);
    };

    window.speechSynthesis.speak(text_speak);
  }

  // AI Response - Fetches and processes AI-generated response
  async function aiResponse(userPrompt) {
    let text = await run(userPrompt);
    let newText =
      text
        .replace(/\*\*/g, "") // Remove bold Markdown formatting
        .replace(/\*/g, "") // Remove any remaining asterisks
        .replace(/Google/g, "Kshitij")
        .replace(/Gemini/g, "Elena")
        .trim()
        .split(".")[0] + "."; // Take only the first sentence for a short response
       


    console.log("Processed AI Response:", newText);
    setPrompt(newText);
    speak(newText);
    setResponse(true);
  }

  // Speech Recognition Setup
  let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new speechRecognition();

  recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript.toLowerCase();
    
    setPrompt(transcript);
    takeCommand(transcript);
  };

  // Process User Voice Commands
  function takeCommand(command) {
    if (command.includes("hello")) {
      let greetingResponse = "Hello! I am Elena, your AI assistant.";
      setPrompt(greetingResponse);
      speak(greetingResponse);
      setResponse(true);
      
      return; // Stops further processing
    }

    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      let youtubeResponse = "Opening YouTube...";
      setPrompt(youtubeResponse);
      speak(youtubeResponse);
      setResponse(true);
      
      return; // Stops further processing
    }

    if (command.includes("open") && command.includes("gmail")) {
      window.open("https://mail.google.com/mail/u/0/?hl=en#inbox", "_blank");
      let gmailResponse = "Opening Gmail...";
      setPrompt(gmailResponse);
      speak(gmailResponse);
      setResponse(true);
      
      return;
    }

     // If no predefined command is found, send to AI
    aiResponse(command);
  }

  return (
    <datacontext.Provider value={{ speak, recognition, speaking, setSpeaking, prompt, setPrompt, response, setResponse }}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
