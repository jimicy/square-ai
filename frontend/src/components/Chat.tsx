import "./Chat.css";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PersonIcon from "@mui/icons-material/Person";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { API_ADDRESS, MessageDict, PUBLIC_URL } from "../App";

import { RefObject } from "react";
import IconButton from "@mui/material/IconButton";
import { useCopyToClipboard } from "usehooks-ts";
import ImageCard from "./ImageCard";
import { Button, Grid } from "@mui/material";

function CatalogMessage(props: {
  text: string;
  role: string;
  type: string;
  data?: any;
  showLoader?: boolean;
  selectedLocale: string;
}) {
  return (
    <>
      <Grid
        container
        spacing={3}
        style={{ marginLeft: 15, maxHeight: 900, overflow: "scroll" }}
      >
        {props.data.map((item: any, index: number) => (
          <ImageCard key={item["id"]} item={item} />
        ))}
      </Grid>
      <div>
        <p>
          Here are the products from your Square Catalog. We use ChatGPT and
          Stable Diffusion to generate a new product.
        </p>
        <p>
          Select the products you want our algorithm to take in as inspiration.
        </p>
        <Button
          variant="contained"
          onClick={() => {}}
          style={{ width: 300, marginBottom: 15 }}
        >
          Generate a new product
        </Button>
      </div>
    </>
  );
  // return (
  //   <>
  //     <h1>Shipping Rate Estimate</h1>
  //     <TableContainer component={Paper}>
  //       <Table sx={{ minWidth: 650 }} aria-label="simple table">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Service Type</TableCell>
  //             <TableCell align="right">Currency&nbsp;</TableCell>
  //             <TableCell align="right">Amount&nbsp;</TableCell>
  //             <TableCell align="right">Package Type&nbsp;</TableCell>
  //             <TableCell align="right">Trackable&nbsp;</TableCell>
  //             <TableCell align="right">Delivery Days&nbsp;</TableCell>
  //             <TableCell align="right">Estimated Delivery Date&nbsp;</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {props.data.map((item: any, index: number) => (
  //             <TableRow
  //               key={index}
  //               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
  //             >
  //               <TableCell component="th" scope="row">
  //                 {item["item_data"]["name"]}
  //               </TableCell>
  //               <TableCell align="right">
  //                 {item["item_data"]["description"]}
  //               </TableCell>
  //               <TableCell align="right">
  //                 <img src={item["item_data"]["image_url"]} alt="product" />
  //               </TableCell>
  //               <TableCell align="right">
  //                 {item["item_data"]["description"]}
  //               </TableCell>
  //               <TableCell align="right">
  //                 {item["item_data"]["description"]}
  //               </TableCell>
  //               <TableCell align="right">
  //                 {item["item_data"]["description"]}
  //               </TableCell>
  //               <TableCell align="right">
  //                 {item["item_data"]["description"]}
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </>
  // );
}

function Message(props: {
  text: string;
  role: string;
  type: string;
  data?: any;
  showLoader?: boolean;
  selectedLocale: string;
}) {
  let { text, role } = props;
  const [_, setCopyToClipboard] = useCopyToClipboard();

  const handleTextToSpeech = (event: React.MouseEvent<Element>) => {
    const foundAudioElement = event.currentTarget?.querySelector("audio");
    if (foundAudioElement) {
      foundAudioElement.play();
    } else {
      const audioElement = document.createElement("audio");
      event.currentTarget?.appendChild(audioElement);

      fetch(`${API_ADDRESS}/synthesize-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text, locale: props.selectedLocale }),
      })
        .then((response) => response.json())
        .then((json) => {
          // Decode the base64-encoded audio content
          const decodedAudio = atob(json["audioContent"]);

          // Create a Uint8Array from the decoded binary data
          const arrayBuffer = new Uint8Array(decodedAudio.length);
          for (let i = 0; i < decodedAudio.length; ++i) {
            arrayBuffer[i] = decodedAudio.charCodeAt(i);
          }

          // Create a Blob from the Uint8Array
          const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

          // Play the audio using the Blob URL
          const sourceElement = document.createElement("source");
          sourceElement.src = URL.createObjectURL(blob);
          sourceElement.type = "audio/mpeg";
          audioElement.appendChild(sourceElement);
          audioElement.play();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const copyToClipboard = () => {
    setCopyToClipboard(text);
  };

  if (props.type === "product-catalog" && props.data) {
    return (
      <div className="message system">
        <div className="avatar-holder">
          <div className="avatar">
            {role === "system" ? (
              <img
                id="system_icon"
                src={`${PUBLIC_URL}/toucan_logoWhite.svg`}
                alt="toucan logo"
              />
            ) : (
              <PersonIcon />
            )}
          </div>
        </div>
        <div className="message-body">
          <CatalogMessage {...props} />
        </div>
      </div>
    );
  }

  return (
    <div className={"message " + (role == "system" ? "system" : "user")}>
      <div className="avatar-holder">
        <div className="avatar">
          {role == "system" ? (
            <img
              id="system_icon"
              src={`${PUBLIC_URL}/toucan_logoWhite.svg`}
              alt="toucan logo"
            />
          ) : (
            <PersonIcon />
          )}
        </div>
      </div>
      <div className="message-body">
        {(props.type == "message" || props.type == "message_raw") &&
          (props.showLoader ? (
            <div>
              {text} {props.showLoader ? <div className="loader"></div> : null}
            </div>
          ) : (
            <div
              className="cell-output"
              dangerouslySetInnerHTML={{ __html: text }}
            ></div>
          ))}

        {props.type == "image/png" && (
          <div
            className="cell-output-image"
            dangerouslySetInnerHTML={{
              __html: `<img src='data:image/png;base64,${text}' />`,
            }}
          ></div>
        )}
        {props.type == "image/jpeg" && (
          <div
            className="cell-output-image"
            dangerouslySetInnerHTML={{
              __html: `<img src='data:image/jpeg;base64,${text}' />`,
            }}
          ></div>
        )}
      </div>
      <div className="message-righthand">
        {role === "system" && (
          <IconButton aria-label="text-to-speech" onClick={handleTextToSpeech}>
            <VolumeUpIcon className="rightHandIcons" />
          </IconButton>
        )}
        <IconButton aria-label="copy-to-clipboard" onClick={copyToClipboard}>
          <ContentCopyIcon className="rightHandIcons" />
        </IconButton>
      </div>
    </div>
  );
}

export enum WaitingStates {
  GeneratingCode = "Toucan AI is writing a reply...",
  RunningCode = "Running code",
  UploadingFile = "Uploading file",
  Idle = "Idle",
}

export default function Chat(props: {
  waitingForSystem: WaitingStates;
  chatScrollRef: RefObject<HTMLDivElement>;
  messages: Array<MessageDict>;
  selectedLocale: string;
}) {
  return (
    <>
      <div className="chat-messages" ref={props.chatScrollRef}>
        {props.messages.map((message, index) => {
          return (
            <Message
              key={index}
              text={message.text}
              role={message.role}
              type={message.type}
              data={message.data}
              selectedLocale={props.selectedLocale}
            />
          );
        })}
        {props.waitingForSystem !== WaitingStates.Idle ? (
          <Message
            text={props.waitingForSystem}
            role="system"
            type="message"
            showLoader={true}
            selectedLocale={props.selectedLocale}
          />
        ) : null}
      </div>
    </>
  );
}
