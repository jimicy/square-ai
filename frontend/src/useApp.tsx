import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { API_ADDRESS, MessageDict } from "./lib/type";
import { WaitingStates } from "./components/Chat";
import { generateContextQuery } from "./lib/AiContext";

export const SupportedLanguages = [
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

export function useAppState() {
  let [selectedLocale, setSelectedLocale] = useLocalStorage<string>(
    "locale",
    navigator.language.startsWith("zh")
      ? navigator.language
      : navigator.language.split("-")[0]
  );

  let [messages, setMessages] = useState<Array<MessageDict>>(
    Array.from([
      {
        text: `Hello! I'm Square AI, I can help you analyze your business and generate new products and campaigns.`,
        role: "system",
        type: "message",
      },
    ])
  );
  let [waitingForSystem, setWaitingForSystem] = useState<WaitingStates>(
    WaitingStates.Idle
  );

  const [onShipCalculatorPage, setOnShipCalculatorPage] = useState(false);

  const addMessage = (message: MessageDict) => {
    setMessages((state: any) => {
      return [...state, message];
    });
  };

  const sendMessage = async (userInput: string, customUserMessage?: string) => {
    try {
      if (userInput.length === 0) {
        return;
      }

      if (customUserMessage) {
        addMessage({
          text: customUserMessage,
          type: "message_raw",
          role: "user",
        });
      } else {
        addMessage({ text: userInput, type: "message", role: "user" });
      }

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

      return data;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const generateProduct = async () => {
    const generateProductPrompt = `Come up with only one new product idea for me, based on products you've seen so far. The products should belong in the same category. Print just the new product name followed by a new line and its description. Please generate a completely different product that is novel, interesting and unique.`;
    const customUserMessage = "Generate me a new product idea!";
    const gptResponse = await sendMessage(
      generateProductPrompt,
      customUserMessage
    );

    const name = gptResponse.text.split("\n")[0];

    setWaitingForSystem(WaitingStates.GeneratingCode);
    let response = await fetch(`${API_ADDRESS}/generate-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: name,
      }),
    });
    setWaitingForSystem(WaitingStates.Idle);

    let data = await response.json();
    for (const img of data) {
      addMessage({
        text: img["base64"],
        type: "image/png",
        role: "system",
        data: { name: name },
      });
    }
  };

  const runCustomerAnalysis = async () => {
    const generateProductPrompt = `Tell me what age buckets have the most count! And show me a psychographic analysis with personality, interest, hobbies, trends, music, food, drinks, TV shows, fashion, sports that those ages groups like. Also for each category give examples, brands, names, show names, restaurant names, etc.`;
    const customUserMessage =
      "Run psychographic analysis on my customer age buckets!";
    await sendMessage(generateProductPrompt, customUserMessage);
  };

  const getStoreCatalog = async function () {
    if (document.hidden) {
      return;
    }
    
    setWaitingForSystem(WaitingStates.GeneratingCode);
    let response = await fetch(`${API_ADDRESS}/fetch-store-catalog`);
    let data = await response.json();
    setWaitingForSystem(WaitingStates.Idle);

    addMessage({
      text: '',
      type: "product-catalog",
      role: "system",
      data: data,
    });
  };

  const getStoreCustomers = async function () {
    if (document.hidden) {
      return;
    }

    setWaitingForSystem(WaitingStates.GeneratingCode);
    let response = await fetch(`${API_ADDRESS}/fetch-customers`);
    let data = await response.json();
    setWaitingForSystem(WaitingStates.Idle);

    addMessage({
      text: '',
      type: "store-customers",
      role: "system",
      data: data,
    });
  };

  const getPopularItemsAnalysis = async function () {
    if (document.hidden) {
        return;
      }
      
      setWaitingForSystem(WaitingStates.GeneratingCode);
      let response = await fetch(`${API_ADDRESS}/popular-items-analysis`);
      let data = await response.json();
      setWaitingForSystem(WaitingStates.Idle);
  
      addMessage({
        text: '',
        type: "popular-items-analysis",
        role: "system",
        data: data,
      });
  }

  return {
    selectedLocale,
    setSelectedLocale,
    messages,
    setMessages,
    waitingForSystem,
    setWaitingForSystem,
    addMessage,
    sendMessage,
    generateProduct,
    runCustomerAnalysis,
    getStoreCatalog,
    getStoreCustomers,
    getPopularItemsAnalysis,
    onShipCalculatorPage,
    setOnShipCalculatorPage,
  };
}
