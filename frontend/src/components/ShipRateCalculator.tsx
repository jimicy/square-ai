import React, { ChangeEvent, useState } from "react";
import "./Chat.css";
import "./ShipRateCalculator.css";
import {
  Box,
  FormControl,
  TextField,
  InputLabel,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { API_ADDRESS } from "../App";

const COUNTRY_CODES = [
  { name: "Afghanistan", code: "AF" },
  { name: "Åland Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "AndorrA", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, The Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cote D'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and Mcdonald Islands", code: "HM" },
  { name: "Holy See (Vatican City State)", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran, Islamic Republic Of", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People'S Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao People'S Democratic Republic", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libyan Arab Jamahiriya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia, Federated States of", code: "FM" },
  { name: "Moldova, Republic of", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "Netherlands Antilles", code: "AN" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestinian Territory, Occupied", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Reunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "RWANDA", code: "RW" },
  { name: "Saint Helena", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia and Montenegro", code: "CS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Swaziland", code: "SZ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan, Province of China", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania, United Republic of", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands, British", code: "VG" },
  { name: "Virgin Islands, U.S.", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];

type DimensionsUnit = {
  unit: "inch" | "centimeter";
  length: number;
  width: number;
  height: number;
};
type Confirmation =
  | "none"
  | "delivery"
  | "signature"
  | "adult_signature"
  | "direct_signature"
  | "delivery_mailed"
  | "verbal_confirmation";
type WeightUnit = "pound" | "ounce" | "gram" | "kilogram";

const weightUnits: Array<WeightUnit> = ["pound", "ounce", "gram", "kilogram"];
const dimensionsUnits: Array<DimensionsUnit["unit"]> = ["inch", "centimeter"];

function ShipRateEstimateForm(props: {
  selectedLocale: string;
  setEstimates: (estimates: Array<Estimate>) => void;
}) {
  const [toCountryCode, setToCountryCode] = useState("");
  const [toPostalCode, setToPostalCode] = useState("");
  const [toCityLocality, setToCityLocality] = useState("");
  const [toStateProvince, setToStateProvince] = useState("");

  const [fromCountryCode, setFromCountryCode] = useState("");
  const [fromPostalCode, setFromPostalCode] = useState("");
  const [fromCityLocality, setFromCityLocality] = useState("");
  const [fromStateProvince, setFromStateProvince] = useState("");

  const [weightValue, setWeightValue] = useState(0);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("gram");

  const [dimensionsUnit, setDimensionsUnit] = useState<DimensionsUnit>({
    unit: "centimeter",
    length: 0,
    width: 0,
    height: 0,
  });

  const [confirmation, setConfirmation] = useState<Confirmation>("none");
  const [shipDate, setShipDate] = useState("");

  const resetValues = () => {
    setToCountryCode("");
    setToPostalCode("");
    setToCityLocality("");
    setToStateProvince("");
    setFromCountryCode("");
    setFromPostalCode("");
    setFromCityLocality("");
    setFromStateProvince("");
  };

  const onSubmit = async (event: any) => {
    const response = await fetch(`${API_ADDRESS}/estimate-ship-rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrier_ids: ["se-4792110", "se-4792111", "se-4792112"],
        from_country_code: fromCountryCode,
        from_postal_code: fromPostalCode,
        from_city_locality: fromCityLocality,
        from_state_province: fromStateProvince,
        to_country_code: toCountryCode,
        to_postal_code: toPostalCode,
        to_city_locality: toCityLocality,
        to_state_province: toStateProvince,
        weight: {
          value: weightValue,
          unit: weightUnit,
        },
        dimensions: {
          unit: dimensionsUnit.unit,
          length: dimensionsUnit.length,
          width: dimensionsUnit.width,
          height: dimensionsUnit.height,
        },
        confirmation: "none",
        address_residential_indicator: "unknown",
      }),
    });
    const data = await response.json();
    props.setEstimates(data);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <h2>Destination</h2>
        <FormControl fullWidth style={{ width: 150 }}>
          <InputLabel id="to-country-code">Country</InputLabel>
          <Select
            id="to-country-code"
            value={toCountryCode}
            onChange={(event: SelectChangeEvent) =>
              setToCountryCode(event.target.value)
            }
            MenuProps={{
              style: {
                maxHeight: 400,
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
          >
            {COUNTRY_CODES.map((country) => (
              <MenuItem value={country.code}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: 250 }}>
          <TextField
            required
            id="outlined-required"
            value={toCityLocality}
            label="City"
            onChange={(event) => setToCityLocality(event.target.value)}
          />
        </FormControl>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="State/Province"
            id="outlined-required"
            value={toStateProvince}
            onChange={(event) => setToStateProvince(event.target.value)}
          />
        </FormControl>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="Postal Code"
            id="outlined-required"
            value={toPostalCode}
            onChange={(event) => setToPostalCode(event.target.value)}
          />
        </FormControl>

        <br />
        <h2>Sender</h2>

        <FormControl fullWidth style={{ width: 150 }}>
          <InputLabel id="from-country-code">Country</InputLabel>
          <Select
            id="from-country-code"
            value={fromCountryCode}
            onChange={(event: SelectChangeEvent) =>
              setFromCountryCode(event.target.value)
            }
            MenuProps={{
              style: {
                maxHeight: 400,
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
          >
            {COUNTRY_CODES.map((country) => (
              <MenuItem id={`${country.code}-b`} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: 250 }}>
          <TextField
            required
            label="City"
            id="from-city"
            value={fromCityLocality}
            onChange={(event) => setFromCityLocality(event.target.value)}
          />
        </FormControl>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="State/Province"
            id="from-province"
            value={fromStateProvince}
            onChange={(event) => setFromStateProvince(event.target.value)}
          />
        </FormControl>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="Postal Code"
            id="from-postal-code"
            value={fromPostalCode}
            onChange={(event) => setFromPostalCode(event.target.value)}
          />
        </FormControl>

        <br />
        <h2>Package Information</h2>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="Weight"
            value={weightValue}
            onChange={(event) =>
              !isNaN(Number(event.target.value))
                ? setWeightValue(Number(event.target.value))
                : setWeightValue(0)
            }
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </FormControl>

        <FormControl fullWidth style={{ width: 150 }}>
          <InputLabel id="weight-unit">Weight Unit</InputLabel>
          <Select
            id="weight-unit"
            value={weightUnit}
            onChange={(event: SelectChangeEvent) =>
              setWeightUnit(event.target.value as WeightUnit)
            }
          >
            {weightUnits.map((unit: WeightUnit) => (
              <MenuItem value={unit}>{unit}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <br />

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="Length"
            value={dimensionsUnit.length}
            onChange={(event) =>
              setDimensionsUnit({
                unit: dimensionsUnit.unit,
                length: !isNaN(Number(event.target.value))
                  ? Number(event.target.value)
                  : 0,
                width: dimensionsUnit.width,
                height: dimensionsUnit.height,
              })
            }
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </FormControl>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="Width"
            value={dimensionsUnit.width}
            onChange={(event) =>
              setDimensionsUnit({
                unit: dimensionsUnit.unit,
                length: dimensionsUnit.length,
                width: !isNaN(Number(event.target.value))
                  ? Number(event.target.value)
                  : 0,
                height: dimensionsUnit.height,
              })
            }
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </FormControl>

        <FormControl style={{ width: 150 }}>
          <TextField
            required
            label="Height"
            value={dimensionsUnit.height}
            onChange={(event) =>
              setDimensionsUnit({
                unit: dimensionsUnit.unit,
                length: dimensionsUnit.length,
                width: dimensionsUnit.width,
                height: !isNaN(Number(event.target.value))
                  ? Number(event.target.value)
                  : 0,
              })
            }
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </FormControl>

        <FormControl fullWidth style={{ width: 150 }}>
          <InputLabel id="package-unit">Package Unit</InputLabel>
          <Select
            id="package-unit"
            value={dimensionsUnit.unit}
            onChange={(event: SelectChangeEvent) =>
              setDimensionsUnit({
                unit: event.target.value as DimensionsUnit["unit"],
                length: dimensionsUnit.length,
                width: dimensionsUnit.width,
                height: dimensionsUnit.height,
              })
            }
          >
            {dimensionsUnits.map((unit: string) => (
              <MenuItem value={unit}>{unit}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Shipment"
            value={shipDate}
            onChange={(newValue) => setShipDate(newValue || "")}
          />
        </LocalizationProvider>
      </Box>

      <div style={{ marginTop: 20, marginLeft: 10 }}>
        <Button variant="outlined" onClick={resetValues}>
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          style={{ marginLeft: 15 }}
        >
          Get Estimate
        </Button>
      </div>
    </>
  );
}

type Estimate = {
  rate_type: string;
  carrier_id: string;
  shipping_amount: {
    currency: string;
    amount: number;
  };
  insurance_amount: {
    currency: string;
    amount: number;
  };
  confirmation_amount: {
    currency: string;
    amount: number;
  };
  other_amount: {
    currency: string;
    amount: number;
  };
  rate_details: [];
  zone: number;
  package_type: string;
  delivery_days: number;
  guaranteed_service: boolean;
  estimated_delivery_date: string;
  carrier_delivery_days: string;
  ship_date: string;
  negotiated_rate: boolean;
  service_type: string;
  service_code: string;
  trackable: boolean;
  carrier_code: string;
  carrier_nickname: string;
  carrier_friendly_name: string;
  validation_status: string;
  warning_messages: [];
  error_messages: [];
};

export default function ShipRateCalculator(props: { selectedLocale: string }) {
  const [estimates, setEstimates] = useState<Array<Estimate>>([]);

  return (
    <>
      <div className="chat-messages">
        <div className="message system calculator">
          <div>
            <h1>Shipping Rate Calculator</h1>
            <p>
              We provide a Rate Estimate comparison between USPS, UPS, Fedex.
            </p>
          </div>
          <ShipRateEstimateForm
            selectedLocale={props.selectedLocale}
            setEstimates={setEstimates}
          />
        </div>
        <div className="message system calculator">
          <div>
            <h1>Shipping Rate Estimate</h1>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service Type</TableCell>
                    <TableCell align="right">Currency&nbsp;</TableCell>
                    <TableCell align="right">Amount&nbsp;</TableCell>
                    <TableCell align="right">Package Type&nbsp;</TableCell>
                    <TableCell align="right">Trackable&nbsp;</TableCell>
                    <TableCell align="right">Delivery Days&nbsp;</TableCell>
                    <TableCell align="right">
                      Estimated Delivery Date&nbsp;
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estimates.map((estimate: Estimate, index: number) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {estimate.service_type}
                      </TableCell>
                      <TableCell align="right">
                        {estimate.shipping_amount.currency}
                      </TableCell>
                      <TableCell align="right">
                        {estimate.shipping_amount.amount}
                      </TableCell>
                      <TableCell align="right">
                        {estimate.package_type
                          ? estimate.package_type.replaceAll("_", " ")
                          : ""}
                      </TableCell>
                      <TableCell align="right">
                        {estimate.trackable ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align="right">
                        {estimate.delivery_days}
                      </TableCell>
                      <TableCell align="right">
                        {new Date(
                          estimate.estimated_delivery_date
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
