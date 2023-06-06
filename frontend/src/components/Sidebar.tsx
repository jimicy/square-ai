import { PUBLIC_URL } from "../lib/type";
import "./Sidebar.css";
import Button from "@mui/material/Button";

export default function Sidebar(props: {
  languages: Array<{ language: string; locale: string }>;
  selectedLocale: string;
  setSelectedLocale: any;
}) {
  const connectSquareStore = () => {};

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <img src={`${PUBLIC_URL}/square_icon.png`} alt="square logo" />
          AI
        </div>
        <div className="settings">
          <label className="header"></label>
          <Button
            className="connectStore"
            variant="contained"
            onClick={connectSquareStore}
            style={{ width: 300, marginBottom: 15 }}
          >
            Connect Square Store
          </Button>
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
