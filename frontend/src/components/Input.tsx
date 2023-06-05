import { useRef, useState } from "react";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import TextareaAutosize from "react-textarea-autosize";
import "./Input.css";
import { Chip } from "@mui/material";

export default function Input(props: {
  onSendMessage: any;
  onStartUpload: any;
  onCompletedUpload: any;
  selectedLocale: string;
}) {
  let fileInputRef = useRef<HTMLInputElement>(null);
  let [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
  let [userInput, setUserInput] = useState<string>("");
  let [listeningToVoice, setListeningToVoice] = useState<boolean>(false);

  const handleInputFocus = () => {
    setInputIsFocused(true);
  };

  const handleInputBlur = () => {
    setInputIsFocused(false);
  };

  const handleUpload = (e: any) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Create a new FormData instance
      const formData = new FormData();

      // Append the file to the form data
      formData.append("file", file);

      props.onStartUpload(file.name);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        props.onCompletedUpload(file.name);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    props.onSendMessage(userInput);
    setUserInput("");
  };

  const handleInputChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      return;
    }

    const SpeechRecognition: any = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continous = true;
    recognition.interimResults = true;
    recognition.lang = props.selectedLocale;
    recognition.start();
    setListeningToVoice(true);

    recognition.onresult = (event: any) => {
      setUserInput(event.results[0][0].transcript);
    };

    recognition.onend = (_event: any) => {
      setListeningToVoice(false);
    };
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="input-parent" style={{ transform: "translateZ(0)" }}>
        <Chip className = "suggestionChip"
          label="Popular items analysis"
          variant="outlined"
          onClick={() => {}}
          style={{
            position: "absolute",
            top: -25,
            left: 15,
            background: "lightyellow",
          }}
        />
        <Chip className = "suggestionChip"
          label="Get store catalog"
          variant="outlined"
          onClick={() => {}}
          style={{
            position: "absolute",
            top: -25,
            left: 180,
            background: "lightyellow",
          }}
        />
        <Chip className = "suggestionChip"
          label="Get store orders"
          variant="outlined"
          onClick={() => {}}
          style={{
            position: "absolute",
            top: -25,
            left: 310,
            background: "lightyellow",
          }}
        />
        <Chip className = "suggestionChip"
          label="Get store customers"
          variant="outlined"
          onClick={() => {}}
          style={{
            position: "absolute",
            top: -25,
            left: 440,
            background: "lightyellow",
          }}
        />
        <div className={"input-holder " + (inputIsFocused ? "focused" : "")}>
          <form className="file-upload">
            <input
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
              type="file"
            />
            <button type="button" onClick={handleUpload}>
              <FileUploadIcon />
            </button>
          </form>
          <button className="send voice" onClick={handleVoiceInput}>
            {!listeningToVoice && <KeyboardVoiceIcon />}
            {listeningToVoice && (
              <div className="pulse">
                <KeyboardVoiceIcon />
              </div>
            )}
          </button>
          <TextareaAutosize
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={userInput}
            rows={1}
            placeholder="Send a message"
          />
          <button className="send" onClick={handleSendMessage}>
            <SendIcon />
          </button>
        </div>
      </div>
    </>
  );
}
