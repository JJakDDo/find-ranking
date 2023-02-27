import { QueryClient, QueryClientProvider } from "react-query";

import { useState } from "react";
import Rank from "./Pages/Rank";

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <Rank />
    </QueryClientProvider>
  );
}

export default App;
