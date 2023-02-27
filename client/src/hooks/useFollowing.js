import { useMutation } from "react-query";
import axios from "axios";

function saveFollowing(body) {
  const { keyword, store } = body;
  return axios.post("http://118.67.133.86:4000/following", {
    keyword,
    store,
  });
}

export function usePostFollowing(onSuccess) {
  return useMutation(saveFollowing, {
    onSuccess,
  });
}
