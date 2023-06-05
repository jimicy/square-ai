import "./App.css";
import Input from "./components/Input";
import Sidebar from "./components/Sidebar";
import Chat, { WaitingStates } from "./components/Chat";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import ShipRateCalculator from "./components/ShipRateCalculator";
import { generateContextQuery } from "./lib/AiContext";

export type MessageDict = {
  text: string;
  role: string;
  type:
    | "message"
    | "message_raw"
    | "system"
    | "product-catalog"
    | "image/png"
    | "image/jpeg";
  data?: any;
};

const Config = {
  API_ADDRESS: "http://localhost:5000/api",
  WEB_ADDRESS: "http://localhost:5000",
};

// eslint-disable-next-line no-restricted-globals
const ORIGIN_URL = new URL(location.origin);
if (ORIGIN_URL.port === "3000") {
  ORIGIN_URL.port = "5000";
}
export const API_ADDRESS = `${ORIGIN_URL.toString()}api`;

// eslint-disable-next-line no-restricted-globals
export const PUBLIC_URL = location.origin;

const SupportedLanguages = [
  { language: "Afrikaans", locale: "af" },
  { language: "Albanian", locale: "sq" },
  { language: "Amharic", locale: "am" },
  { language: "Arabic", locale: "ar" },
  { language: "Armenian", locale: "hy" },
  { language: "Assamese", locale: "as" },
  { language: "Aymara", locale: "ay" },
  { language: "Azerbaijani", locale: "az" },
  { language: "Bambara", locale: "bm" },
  { language: "Basque", locale: "eu" },
  { language: "Belarusian", locale: "be" },
  { language: "Bengali", locale: "bn" },
  { language: "Bhojpuri", locale: "bho" },
  { language: "Bosnian", locale: "bs" },
  { language: "Bulgarian", locale: "bg" },
  { language: "Catalan", locale: "ca" },
  { language: "Cebuano", locale: "ceb" },
  { language: "Chinese (Simplified)", locale: "zh-CN" },
  { language: "Chinese (Traditional)", locale: "zh-TW" },
  { language: "Corsican", locale: "co" },
  { language: "Croatian", locale: "hr" },
  { language: "Czech", locale: "cs" },
  { language: "Danish", locale: "da" },
  { language: "Dhivehi", locale: "dv" },
  { language: "Dogri", locale: "doi" },
  { language: "Dutch", locale: "nl" },
  { language: "English", locale: "en" },
  { language: "Esperanto", locale: "eo" },
  { language: "Estonian", locale: "et" },
  { language: "Ewe", locale: "ee" },
  { language: "Filipino (Tagalog)", locale: "fil" },
  { language: "Finnish", locale: "fi" },
  { language: "French", locale: "fr" },
  { language: "Frisian", locale: "fy" },
  { language: "Galician", locale: "gl" },
  { language: "Georgian", locale: "ka" },
  { language: "German", locale: "de" },
  { language: "Greek", locale: "el" },
  { language: "Guarani", locale: "gn" },
  { language: "Gujarati", locale: "gu" },
  { language: "Haitian Creole", locale: "ht" },
  { language: "Hausa", locale: "ha" },
  { language: "Hawaiian", locale: "haw" },
  { language: "Hebrew", locale: "he or iw" },
  { language: "Hindi", locale: "hi" },
  { language: "Hmong", locale: "hmn" },
  { language: "Hungarian", locale: "hu" },
  { language: "Icelandic", locale: "is" },
  { language: "Igbo", locale: "ig" },
  { language: "Ilocano", locale: "ilo" },
  { language: "Indonesian", locale: "id" },
  { language: "Irish", locale: "ga" },
  { language: "Italian", locale: "it" },
  { language: "Japanese", locale: "ja" },
  { language: "Javanese", locale: "jv or jw" },
  { language: "Kannada", locale: "kn" },
  { language: "Kazakh", locale: "kk" },
  { language: "Khmer", locale: "km" },
  { language: "Kinyarwanda", locale: "rw" },
  { language: "Konkani", locale: "gom" },
  { language: "Korean", locale: "ko" },
  { language: "Krio", locale: "kri" },
  { language: "Kurdish", locale: "ku" },
  { language: "Kurdish (Sorani)", locale: "ckb" },
  { language: "Kyrgyz", locale: "ky" },
  { language: "Lao", locale: "lo" },
  { language: "Latin", locale: "la" },
  { language: "Latvian", locale: "lv" },
  { language: "Lingala", locale: "ln" },
  { language: "Lithuanian", locale: "lt" },
  { language: "Luganda", locale: "lg" },
  { language: "Luxembourgish", locale: "lb" },
  { language: "Macedonian", locale: "mk" },
  { language: "Maithili", locale: "mai" },
  { language: "Malagasy", locale: "mg" },
  { language: "Malay", locale: "ms" },
  { language: "Malayalam", locale: "ml" },
  { language: "Maltese", locale: "mt" },
  { language: "Maori", locale: "mi" },
  { language: "Marathi", locale: "mr" },
  { language: "Meiteilon (Manipuri)", locale: "mni-Mtei" },
  { language: "Mizo", locale: "lus" },
  { language: "Mongolian", locale: "mn" },
  { language: "Myanmar (Burmese)", locale: "my" },
  { language: "Nepali", locale: "ne" },
  { language: "Norwegian", locale: "no" },
  { language: "Nyanja (Chichewa)", locale: "ny" },
  { language: "Odia (Oriya)", locale: "or" },
  { language: "Oromo", locale: "om" },
  { language: "Pashto", locale: "ps" },
  { language: "Persian", locale: "fa" },
  { language: "Polish", locale: "pl" },
  { language: "Portuguese (Portugal, Brazil)", locale: "pt" },
  { language: "Punjabi", locale: "pa" },
  { language: "Quechua", locale: "qu" },
  { language: "Romanian", locale: "ro" },
  { language: "Russian", locale: "ru" },
  { language: "Samoan", locale: "sm" },
  { language: "Sanskrit", locale: "sa" },
  { language: "Scots Gaelic", locale: "gd" },
  { language: "Sepedi", locale: "nso" },
  { language: "Serbian", locale: "sr" },
  { language: "Sesotho", locale: "st" },
  { language: "Shona", locale: "sn" },
  { language: "Sindhi", locale: "sd" },
  { language: "Sinhala (Sinhalese)", locale: "si" },
  { language: "Slovak", locale: "sk" },
  { language: "Slovenian", locale: "sl" },
  { language: "Somali", locale: "so" },
  { language: "Spanish", locale: "es" },
  { language: "Sundanese", locale: "su" },
  { language: "Swahili", locale: "sw" },
  { language: "Swedish", locale: "sv" },
  { language: "Tagalog (Filipino)", locale: "tl" },
  { language: "Tajik", locale: "tg" },
  { language: "Tamil", locale: "ta" },
  { language: "Tatar", locale: "tt" },
  { language: "Telugu", locale: "te" },
  { language: "Thai", locale: "th" },
  { language: "Tigrinya", locale: "ti" },
  { language: "Tsonga", locale: "ts" },
  { language: "Turkish", locale: "tr" },
  { language: "Turkmen", locale: "tk" },
  { language: "Twi (Akan)", locale: "ak" },
  { language: "Ukrainian", locale: "uk" },
  { language: "Urdu", locale: "ur" },
  { language: "Uyghur", locale: "ug" },
  { language: "Uzbek", locale: "uz" },
  { language: "Vietnamese", locale: "vi" },
  { language: "Welsh", locale: "cy" },
  { language: "Xhosa", locale: "xh" },
  { language: "Yiddish", locale: "yi" },
  { language: "Yoruba", locale: "yo" },
  { language: "Zulu", locale: "zu}" },
];

function App() {
  const COMMANDS = ["reset"];
  const MODELS = [
    {
      displayName: "GPT-3.5",
      name: "gpt-3.5-turbo",
    },
    {
      displayName: "GPT-4",
      name: "gpt-4",
    },
  ];

  let [selectedModel, setSelectedModel] = useLocalStorage<string>(
    "model",
    MODELS[0].name
  );

  let [selectedLocale, setSelectedLocale] = useLocalStorage<string>(
    "locale",
    navigator.language.startsWith("zh")
      ? navigator.language
      : navigator.language.split("-")[0]
  );

  let [messages, setMessages] = useState<Array<MessageDict>>(
    Array.from([
      {
        text: `Hello! I'm Toucan, an AI powered consultant fined tuned for the international trade, shipping, logistics industry. I can help you with your international trade needs!
  You can ask me questions like:
  • How do I ship from Malaysia to United States? Explain step by step.
  • What the tax rate for sales of goods, provisions of services and import for Thailand?`,
        role: "system",
        type: "message",
      },
    ])
  );
  let [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(
    WaitingStates.Idle
  );
  const chatScrollRef = React.useRef<HTMLDivElement>(null);

  const [onShipCalculatorPage, setOnShipCalculatorPage] = useState(false);

  const addMessage = (message: MessageDict) => {
    setMessages((state: any) => {
      return [...state, message];
    });
  };

  const handleCommand = (command: string) => {
    if (command === "reset") {
      addMessage({
        text: "Restarting the kernel.",
        type: "message",
        role: "system",
      });

      fetch(`${Config.API_ADDRESS}/restart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then(() => {})
        .catch((error) => console.error("Error:", error));
    }
  };

  const sendMessage = async (userInput: string) => {
    try {
      if (COMMANDS.includes(userInput)) {
        handleCommand(userInput);
        return;
      }

      if (userInput.length === 0) {
        return;
      }

      addMessage({ text: userInput, type: "message", role: "user" });
      setWaitingForSystem(WaitingStates.GeneratingCode);

      const response = await fetch(`${API_ADDRESS}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: generateContextQuery(messages, userInput),
          locale: selectedLocale,
        }),
      });
      const data = await response.json();
      const text = data.text;

      setWaitingForSystem(WaitingStates.Idle);

      if (response.status === 200) {
        addMessage({ text: text, type: "message", role: "system" });
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const getStoreCatalog = React.useCallback(async function () {
    if (document.hidden) {
      return;
    }

    let response = await fetch(`${Config.API_ADDRESS}/fetch-store-catalog`);
    let data = await response.json();
    return data;
  }, []);

  React.useEffect(() => {
    let ignore = false;
    getStoreCatalog().then((data) => {
      if (ignore) {
        return;
      }

      console.log(data);

      addMessage({
        text: `Here are some of the products from your store catalog!`,
        type: "product-catalog",
        role: "system",
        data: data,
      });
    });

    return () => {
      ignore = true;
    };
  }, [getStoreCatalog]);

  function completeUpload(filename: string) {
    addMessage({
      text: `File ${filename} was uploaded successfully.`,
      type: "message",
      role: "system",
    });

    setWaitingForSystem(WaitingStates.Idle);

    // Inform prompt server
    fetch(`${Config.WEB_ADDRESS}/inject-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `File ${filename} was uploaded successfully.`,
      }),
    })
      .then(() => {})
      .catch((error) => console.error("Error:", error));
  }

  function startUpload(_: string) {
    setWaitingForSystem(WaitingStates.UploadingFile);
  }

  React.useEffect(() => {
    if (chatScrollRef.current == null) {
      return;
    }

    // Scroll down container by setting scrollTop to the height of the container
    chatScrollRef.current!.scrollTop = chatScrollRef.current!.scrollHeight;
  }, [chatScrollRef, messages]);

  // Capture <a> clicks for download links
  React.useEffect(() => {
    const clickHandler = (event: any) => {
      let element = event.target;

      // If an <a> element was found, prevent default action and do something else
      if (element != null && element.tagName === "A") {
        // Check if href starts with /download

        if (element.getAttribute("href").startsWith(`/download`)) {
          event.preventDefault();

          // Make request to ${Config.WEB_ADDRESS}/download instead
          // make it by opening a new tab
          window.open(`${Config.WEB_ADDRESS}${element.getAttribute("href")}`);
        }
      }
    };

    // Add the click event listener to the document
    document.addEventListener("click", clickHandler);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <>
      <div className="app">
        <Sidebar
          models={MODELS}
          selectedModel={selectedModel}
          languages={SupportedLanguages}
          selectedLocale={selectedLocale}
          setSelectedLocale={setSelectedLocale}
          onSelectModel={(val: string) => {
            setSelectedModel(val);
          }}
          onShipCalculatorPage={onShipCalculatorPage}
          setOnShipCalculatorPage={setOnShipCalculatorPage}
        />
        <div className="main">
          {onShipCalculatorPage && (
            <ShipRateCalculator selectedLocale={selectedLocale} />
          )}
          {!onShipCalculatorPage && (
            <Chat
              chatScrollRef={chatScrollRef}
              waitingForSystem={waitingForSystem}
              messages={messages}
              selectedLocale={selectedLocale}
            />
          )}
          {!onShipCalculatorPage && (
            <Input
              onSendMessage={sendMessage}
              onCompletedUpload={completeUpload}
              onStartUpload={startUpload}
              selectedLocale={selectedLocale}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
