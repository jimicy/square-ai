import "./Sidebar.css";
import { PUBLIC_URL } from "../App";
import Button from "@mui/material/Button";

export default function Sidebar(props: {
  models: Array<{ name: string; displayName: string }>;
  selectedModel: string;
  onSelectModel: any;

  languages: Array<{ language: string; locale: string }>;
  selectedLocale: string;
  setSelectedLocale: any;
  onShipCalculatorPage: boolean;
  setOnShipCalculatorPage: (value: boolean) => void;
}) {
  const connectSquareStore = () => {};

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <img src={`${PUBLIC_URL}/toucan_logo.svg`} alt="toucan logo" />
          TOUCAN
          <div className="github">
            <a href="https://github.com/jimicy/square-ai">Open Source</a>
          </div>
        </div>
        <div className="settings">
          <label className="header"></label>
          <Button
            variant="contained"
            onClick={connectSquareStore}
            style={{ width: 300, marginBottom: 15 }}
          >
            Connect Square Store
          </Button>
          {!props.onShipCalculatorPage && (
            <Button
              variant="contained"
              onClick={() => props.setOnShipCalculatorPage(true)}
              style={{ width: 300 }}
            >
              Shipping Rate Calculator
            </Button>
          )}
          {props.onShipCalculatorPage && (
            <Button
              variant="contained"
              onClick={() => props.setOnShipCalculatorPage(false)}
              style={{ width: 300 }}
            >
              Chat AI
            </Button>
          )}
          <label>Languages</label>
          <select
            value={props.selectedLocale}
            onChange={(event) => props.setSelectedLocale(event.target.value)}
          >
            {props.languages.map((language, index) => {
              return (
                <option key={index} value={language.locale}>
                  {language.language}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </>
  );
}
