import React, { useEffect, useRef } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { usePostFollowing } from "../../hooks/useFollowing";

function InputForm({ setTodayRank }) {
  const keywordRef = useRef(null);
  const storeRef = useRef(null);

  const onSuccess = (data) => {
    const addedKeyword = data?.data?.rank;
    if (addedKeyword) {
      setTodayRank((prev) => {
        let foundIndex = prev.findIndex(
          (data) => data.title === addedKeyword.title
        );
        if (foundIndex >= 0) {
          prev[foundIndex].keywords.push({
            keyword: addedKeyword.keyword,
            rank: addedKeyword.rank,
            position: addedKeyword.position,
            upOrDown: addedKeyword.upOrDown,
            changeInRank: addedKeyword.changeInRank,
          });
        } else {
          prev.push({
            title: addedKeyword.title,
            store: addedKeyword.store,
            keywords: [
              {
                keyword: addedKeyword.keyword,
                rank: addedKeyword.rank,
                position: addedKeyword.position,
                upOrDown: addedKeyword.upOrDown,
                changeInRank: addedKeyword.changeInRank,
              },
            ],
          });
        }

        return [...prev];
      });
    }
  };
  const { mutate, isLoading } = usePostFollowing(onSuccess);

  const onSubmit = () => {
    if (keywordRef.current.value && storeRef.current.value) {
      mutate({
        keyword: keywordRef.current.value,
        store: storeRef.current.value,
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      keywordRef.current.value = "";
      storeRef.current.value = "";
    }
  }, [isLoading]);

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
        id='outlined-basic'
        label='키워드'
        variant='outlined'
        inputRef={keywordRef}
        sx={{ mb: 1 }}
      />
      <TextField
        id='outlined-basic'
        label='스토어'
        variant='outlined'
        inputRef={storeRef}
        sx={{ mb: 2 }}
      />
      <Button variant='contained' onClick={onSubmit} disabled={isLoading}>
        추적!
      </Button>
      {isLoading && <CircularProgress />}
    </Box>
  );
}

export default InputForm;
