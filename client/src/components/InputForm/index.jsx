import React from "react";
import { Box, Button, TextField } from "@mui/material";

function InputForm() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "300px",
        margin: "0 auto",
      }}
    >
      <TextField
        id="outlined-basic"
        label="키워드"
        variant="outlined"
        sx={{ mb: 1 }}
      />
      <TextField
        id="outlined-basic"
        label="스토어"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button variant="contained">추적!</Button>
    </Box>
  );
}

export default InputForm;
