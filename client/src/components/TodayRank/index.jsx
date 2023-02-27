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
import HorizontalRuleTwoToneIcon from "@mui/icons-material/HorizontalRuleTwoTone";
import ArrowDropDownTwoToneIcon from "@mui/icons-material/ArrowDropDownTwoTone";
import ArrowDropUpTwoToneIcon from "@mui/icons-material/ArrowDropUpTwoTone";
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
          {rank.keywords.map((keyword, index) => {
            console.log(keyword.upOrDown);
            let icon = (
              <HorizontalRuleTwoToneIcon
                fontSize="small"
                sx={{ color: "grey" }}
              />
            );
            if (keyword.upOrDown === "-") {
              icon = <ArrowDropDownTwoToneIcon fontSize="small" />;
            } else if (keyword.upOrDown === "+") {
              icon = <ArrowDropUpTwoToneIcon fontSize="small" />;
            }
            return (
              <ListItem key={index}>
                <ListItemButton>
                  <ListItemText
                    id="switch-list-label-wifi"
                    primary={keyword.keyword}
                  />
                  <ListItemText
                    id="switch-list-label-wifi"
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            color: keyword.upOrDown === "-" ? "red" : "green",
                            fontSize: "0.8rem",
                          }}
                        >
                          {icon}
                          {keyword.changeInRank > 0 && keyword.changeInRank}
                        </Box>
                        {keyword.rank}위
                      </Box>
                    }
                    secondary={keyword.position}
                    sx={{ textAlign: "right" }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </Card>
      ))}
    </Box>
  );
}

export default TodayRank;
