import { useQuery } from "react-query";
import axios from "axios";

function fetchRanks() {
  return axios.get("http://localhost:4000/rank");
}

export function useGetRanks() {
  return useQuery(
    ["ranks"],
    async () => {
      const results = await fetchRanks();
      if (results.status < 300) {
        return results.data.results;
      }

      return [];
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
