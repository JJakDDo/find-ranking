import React, { useState, useEffect } from "react";
import InputForm from "../components/InputForm";
import TodayRank from "../components/TodayRank";
import { useGetRanks } from "../hooks/useRank";

function Rank() {
  const [todayRank, setTodayRank] = useState([]);
  const { data: ranks } = useGetRanks();

  useEffect(() => {
    if (ranks) {
      let tempRank = {};
      for (const data of ranks) {
        if (!tempRank[data.title]) {
          tempRank[data.title] = {
            title: data.title,
            store: data.store,
            keywords: [
              {
                keyword: data.keyword,
                rank: data.rank,
                position: data.position,
                upOrDown: data.upOrDown,
                changeInRank: data.changeInRank,
              },
            ],
          };
        } else {
          tempRank[data.title].keywords.push({
            keyword: data.keyword,
            rank: data.rank,
            position: data.position,
            upOrDown: data.upOrDown,
            changeInRank: data.changeInRank,
          });
        }
      }

      setTodayRank(Object.entries(tempRank).map(([, value]) => value));
    }
  }, [ranks]);

  useEffect(() => {
    console.log(todayRank);
  }, [todayRank]);
  return (
    <>
      <InputForm setTodayRank={setTodayRank} />
      <TodayRank todayRank={todayRank} />
    </>
  );
}

export default Rank;
