import "./Chat.css";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PersonIcon from "@mui/icons-material/Person";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { RefObject } from "react";
import IconButton from "@mui/material/IconButton";
import { useCopyToClipboard } from "usehooks-ts";
import ImageCard from "./ImageCard";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { API_ADDRESS, Customer, MessageDict, PUBLIC_URL, PopularItem, PopularItemAnalysis } from "../lib/type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CatalogMessage(props: { data: any; generateProduct?: () => void }) {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Typography paragraph>
          Here are the products from your Square Catalog. We use ChatGPT and
          Stable Diffusion to generate a new product. <br />
          Select the products you want our algorithm to take in as inspiration.
        </Typography>
        <Button
          className="generateProduct"
          variant="contained"
          onClick={props.generateProduct}
          style={{ width: 300, marginBottom: 15 }}
        >
          Generate a new product
        </Button>
      </div>
      <Grid
        container
        spacing={3}
        style={{
          marginLeft: 15,
          maxHeight: 900,
          overflow: "scroll",
        }}
      >
        {props.data.map((item: any, index: number) => (
          <ImageCard key={item["id"]} item={item} />
        ))}
      </Grid>
    </>
  );
}

function StoreCustomersMessage(props: {
  data: any;
  runCustomerAnalysis: () => void;
}) {
  const labels = [];
  const barValues = [];
  for (const ageBucket of [
    "<18",
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+",
  ]) {
    labels.push(ageBucket);
    barValues.push(props.data.ageBuckets[ageBucket]);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Customers By Age Buckets",
      },
    },
  };

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "Total",
        data: barValues,
        borderColor: "#e0bc53",
        backgroundColor: "#ffd761",
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  return (
    <>
      <Typography variant="h3" className="heading">
        Store Customers
      </Typography>
      <Button
        className="generateProduct"
        variant="contained"
        onClick={props.runCustomerAnalysis}
        style={{ width: 300, marginBottom: 15 }}
      >
        Run psychographic analysis
      </Button>
      <div
        className="chart-container"
        style={{ position: "relative", height: "40vh", width: "80vw" }}
      >
        <Bar data={barData} options={options} />
      </div>
      <Typography variant="body2" color="text.secondary">
        Preview of the store customers data. Limited to only showing 20
        customers.
      </Typography>
      <TableContainer
        component={Paper}
        style={{
          minWidth: 650,
          maxWidth: 1400,
          width: "100%",
          maxHeight: 600,
          overflow: "scroll",
        }}
      >
        <Table aria-label="square store customers table">
          <TableHead>
            <TableRow>
              <TableCell>Given name</TableCell>
              <TableCell align="right">Family name&nbsp;</TableCell>
              <TableCell align="right">Birthday&nbsp;</TableCell>
              <TableCell align="right">Email&nbsp;</TableCell>
              <TableCell align="right">Created At&nbsp;</TableCell>
              <TableCell align="right">Address&nbsp;</TableCell>
              <TableCell align="right">Locality&nbsp;</TableCell>
              <TableCell align="right">Postal Code&nbsp;</TableCell>
              <TableCell align="right">Country&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.customers.map((customer: Customer, index: number) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {customer.given_name}
                </TableCell>
                <TableCell align="right">{customer.family_name}</TableCell>
                <TableCell align="right">
                  {new Date(customer.birthday).toDateString()}
                </TableCell>
                <TableCell align="right">{customer.email_address}</TableCell>
                <TableCell align="right">
                  {new Date(customer.created_at).toDateString()}
                </TableCell>
                <TableCell align="right">
                  {customer.address.address_line_1}
                </TableCell>
                <TableCell align="right">{customer.address.locality}</TableCell>
                <TableCell align="right">
                  {customer.address.postal_code}
                </TableCell>
                <TableCell align="right">{customer.address.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function PopularItemsAnalysisMessage(props: { data: PopularItemAnalysis, generateProduct: () => void }) {
  return (
    <>
      <Typography variant="h5" className="heading">
      Here is your Popular Products Analysis.
      </Typography>
      <div style={{ marginBottom: 20 }}>
        <Typography paragraph>
          Your products are sorted by numbers sold<br />
          1. For each of them, count all the customers to figure out the most popular age bucket.<br />
          2. For the top 3 products and their popular age buckets we generate a demographic psychographic analysis.
        </Typography>
      </div>
      <TableContainer
        component={Paper}
        className="popularProductsTable"
      >
        <Table aria-label="square store customers table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Most popular with ages&nbsp;</TableCell>
              <TableCell align="right">Total number sold&nbsp;</TableCell>
              <TableCell align="right">Total Sales&nbsp;</TableCell>
              <TableCell align="right">Catalog id&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.most_popular_items.map((popularItem: PopularItem, index: number) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {popularItem.name}
                </TableCell>
                <TableCell align="right">{popularItem.popular_age_bucket}</TableCell>
                <TableCell align="right">{popularItem.total_quantity}</TableCell>
                <TableCell align="right">${popularItem.total_sales}</TableCell>
                <TableCell align="right">{popularItem.catalog_object_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper style={{padding: 15, margin: 10}}>
          <Typography paragraph style={{whiteSpace: 'pre-wrap'}}>
            {props.data.top_three_items_analysis.replaceAll("\n\n", "\n")}
          </Typography>
        </Paper>
      <Typography paragraph>
        You can now generate a new product that is inspired by your top 3 popular products
        and their demographic's psychographic analysis.  <br />
        We use ChatGPT and Stable Diffusion to generate a new product.
        </Typography>
        <Button
          className="generateProduct"
          variant="contained"
          onClick={props.generateProduct}
          style={{ width: 300, marginBottom: 15 }}
        >
          Generate a new product
        </Button>
    </>
  );
}

function SubscriptionItemsAnalysisMessage(props: { data: any }) {
  return (
    <>
      <Typography variant="h5" className="heading">
      Here is your Subscription Products Analysis.
      </Typography>
      <div style={{ marginBottom: 20 }}>
        <Typography paragraph>
          Your subscriptions are sorted by numbers sold<br />
          1. For each of them, count all the customers to figure out the most popular age bucket.<br />
          2. For the top subscription, for its customers we generate a demographic psychographic analysis on the top 3 customer age buckets.
        </Typography>
      </div>
      <TableContainer
        component={Paper}
        className="popularProductsTable"
      >
        <Table aria-label="square store customers table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Total numbers sold&nbsp;</TableCell>
              <TableCell align="right">Age buckets&nbsp;</TableCell>
              <TableCell align="right">Plan ID&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.most_popular_items.map((popularItem: any, index: number) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {popularItem.name}
                </TableCell>
                <TableCell align="right">{popularItem.total_quantity}</TableCell>
                <TableCell align="right">{popularItem.popular_age_bucket.toString()}</TableCell>
                <TableCell align="right">{popularItem.plan_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper style={{padding: 15, margin: 10}}>
          <Typography paragraph style={{whiteSpace: 'pre-wrap'}}>
            {props.data.top_three_items_analysis.replaceAll("\n\n", "\n")}
          </Typography>
        </Paper>
    </>
  );
}

function Message(props: {
  text: MessageDict["text"];
  role: MessageDict["role"];
  type: MessageDict["type"];
  data?: any;
  showLoader?: boolean;
  generateProduct?: () => void;
  runCustomerAnalysis?: () => void;
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

  if (props.type === "product-catalog" && props.data && props.generateProduct) {
    return (
      <div className="message system">
        <div className="avatar-holder">
          <div className="avatar">
            {role === "system" ? (
              <img
                id="system_icon"
                src={`${PUBLIC_URL}/square_bot.svg`}
                alt="Square AI"
              />
            ) : (
              <PersonIcon />
            )}
          </div>
        </div>
        <div className="message-body">
          <CatalogMessage
            data={props.data}
            generateProduct={props.generateProduct}
          />
        </div>
      </div>
    );
  }

  if (
    props.type === "store-customers" &&
    props.data &&
    props.runCustomerAnalysis
  ) {
    return (
      <div className="message system">
        <div className="avatar-holder">
          <div className="avatar">
            {role === "system" ? (
              <img
                id="system_icon"
                src={`${PUBLIC_URL}/square_bot.svg`}
                alt="Square AI"
              />
            ) : (
              <PersonIcon />
            )}
          </div>
        </div>
        <div className="message-body">
          <StoreCustomersMessage
            data={props.data}
            runCustomerAnalysis={props.runCustomerAnalysis}
          />
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
              src={`${PUBLIC_URL}/square_bot.svg`}
              alt="Square AI"
            />
          ) : (
            <PersonIcon />
          )}
        </div>
      </div>
      <div className="message-body">
        {(props.type === "message" || props.type === "message_raw") &&
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
        {props.type === "store-subscriptions-analysis" && props.data && (
          <SubscriptionItemsAnalysisMessage data={props.data} />
        )}
        {props.type === "popular-items-analysis" && props.data && props.generateProduct && (
          <PopularItemsAnalysisMessage data={props.data} generateProduct={props.generateProduct}/>
        )}
        {props.type === "image/png" && (
          <>
            <Typography variant="h2" className="heading heading2">
              Generated Image for: {props.data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generated using Stable Diffusion 2.2 XL
            </Typography>
            <div
              className="cell-output-image generatedImg"
              dangerouslySetInnerHTML={{
                __html: `<img src='data:image/png;base64,${text}' />`,
              }}
            ></div>
          </>
        )}
        {props.type === "image/jpeg" && (
          <>
            <Typography variant="h2" className="heading heading2">
              Generated Image for: {props.data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generated using Stable Diffusion V2.1
            </Typography>
            <div
              className="cell-output-image generatedImg"
              dangerouslySetInnerHTML={{
                __html: `<img src='data:image/jpeg;base64,${text}' />`,
              }}
            ></div>
          </>
        )}
      </div>
      {props.type === "message" && (
        <div className="message-righthand">
          {role === "system" && (
            <IconButton
              aria-label="text-to-speech"
              onClick={handleTextToSpeech}
            >
              <VolumeUpIcon className="rightHandIcons" />
            </IconButton>
          )}
          <IconButton aria-label="copy-to-clipboard" onClick={copyToClipboard}>
            <ContentCopyIcon className="rightHandIcons" />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export enum WaitingStates {
  GeneratingCode = "Square AI is writing a reply...",
  RunningCode = "Running code",
  UploadingFile = "Uploading file",
  Idle = "Idle",
}

export default function Chat(props: {
  waitingForSystem: WaitingStates;
  chatScrollRef: RefObject<HTMLDivElement>;
  messages: Array<MessageDict>;
  selectedLocale: string;
  generateProduct: () => void;
  runCustomerAnalysis: () => void;
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
              generateProduct={props.generateProduct}
              runCustomerAnalysis={props.runCustomerAnalysis}
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
