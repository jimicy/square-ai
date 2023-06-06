import "./ImageCard.css";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Checkbox } from "@mui/material";
import { Item } from "../lib/type";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ImageCard(props: { item: Item }) {
  const item = props.item;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }} style={{ margin: 10 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "white" }} className="storeAvatar">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/Square%2C_Inc_-_Square_Logo.jpg" />
          </Avatar>
        }
        action={<Checkbox defaultChecked />}
        title={item.item_data?.name}
        subheader={new Date(item.created_at).toDateString()}
      />
      <CardMedia
        component="img"
        height="194"
        image={item.item_data?.image_url}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {item.item_data?.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
