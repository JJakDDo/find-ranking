import {
  Box,
  Card,
  CardContent,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

function TodayRank({ todayRank }) {
  console.log(todayRank);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "650px",
        margin: "0 auto",
        mt: 3,
        gap: 2,
      }}
    >
      {todayRank?.map((rank) => (
        <Card sx={{ maxWidth: 650 }} key={rank.title}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {rank.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rank.store}
            </Typography>
          </CardContent>
          <Divider />
          {rank.keywords.map((keyword, index) => (
            <ListItem key={index}>
              <ListItemButton>
                <ListItemText
                  id="switch-list-label-wifi"
                  primary={keyword.keyword}
                />
                <ListItemText
                  id="switch-list-label-wifi"
                  primary={`${keyword.rank}위`}
                  secondary={keyword.position}
                  sx={{ textAlign: "right" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Card>
      ))}
    </Box>
  );
}

export default TodayRank;
