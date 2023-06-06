import { useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import TextareaAutosize from "react-textarea-autosize";
import "./Input.css";
import { Chip } from "@mui/material";

export default function Input(props: {
  onSendMessage: any;
  selectedLocale: string;
  getStoreCatalog: () => void;
  getStoreCustomers: () => void;
  getPopularItemsAnalysis: () => void;
}) {
  let [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
  let [userInput, setUserInput] = useState<string>("");
  let [listeningToVoice, setListeningToVoice] = useState<boolean>(false);

  const handleInputFocus = () => {
    setInputIsFocused(true);
  };

  const handleInputBlur = () => {
    setInputIsFocused(false);
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
        <Chip
          className="suggestionChip"
          label="Popular items analysis"
          variant="outlined"
          onClick={props.getPopularItemsAnalysis}
          style={{
            position: "absolute",
            top: -25,
            left: 15,
            background: "lightyellow",
          }}
        />
        <Chip
          className="suggestionChip"
          label="Get store catalog"
          variant="outlined"
          onClick={props.getStoreCatalog}
          style={{
            position: "absolute",
            top: -25,
            left: 180,
            background: "lightyellow",
          }}
        />
        <Chip
          className="suggestionChip"
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
        <Chip
          className="suggestionChip"
          label="Get store customers"
          variant="outlined"
          onClick={props.getStoreCustomers}
          style={{
            position: "absolute",
            top: -25,
            left: 440,
            background: "lightyellow",
          }}
        />
        <Chip
          className="suggestionChip"
          label="Get store subscriptions"
          variant="outlined"
          onClick={() => {}}
          style={{
            position: "absolute",
            top: -25,
            left: 590,
            background: "lightyellow",
          }}
        />
        <div className={"input-holder " + (inputIsFocused ? "focused" : "")}>
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
