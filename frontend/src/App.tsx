import "./App.css";
import Input from "./components/Input";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import ShipRateCalculator from "./components/ShipRateCalculator";
import { SupportedLanguages, useAppState } from "./useApp";
import React from "react";

function App() {
  const {
    selectedLocale,
    setSelectedLocale,
    onShipCalculatorPage,
    setOnShipCalculatorPage,
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
              generateProduct={generateProduct}
              runCustomerAnalysis={runCustomerAnalysis}
            />
          )}
          {!onShipCalculatorPage && (
            <Input
              onSendMessage={sendMessage}
              selectedLocale={selectedLocale}
              getStoreCatalog={getStoreCatalog}
              getStoreCustomers={getStoreCustomers}
              getPopularItemsAnalysis={getPopularItemsAnalysis}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
