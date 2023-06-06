import "./App.css";
import Input from "./components/Input";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { SupportedLanguages, useAppState } from "./useApp";
import React from "react";

function App() {
  const {
    selectedLocale,
    setSelectedLocale,
    waitingForSystem,
    messages,
    sendMessage,
    generateProduct,
    runCustomerAnalysis,
    getStoreCatalog,
    getStoreCustomers,
    getPopularItemsAnalysis,
  } = useAppState();

  const chatScrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="app">
        <Sidebar
          languages={SupportedLanguages}
          selectedLocale={selectedLocale}
          setSelectedLocale={setSelectedLocale}
        />
        <div className="main">
          <Chat
              chatScrollRef={chatScrollRef}
              waitingForSystem={waitingForSystem}
              messages={messages}
              selectedLocale={selectedLocale}
              generateProduct={generateProduct}
              runCustomerAnalysis={runCustomerAnalysis}
            />
          <Input
              onSendMessage={sendMessage}
              selectedLocale={selectedLocale}
              getStoreCatalog={getStoreCatalog}
              getStoreCustomers={getStoreCustomers}
              getPopularItemsAnalysis={getPopularItemsAnalysis}
            />
        </div>
      </div>
    </>
  );
}

export default App;
