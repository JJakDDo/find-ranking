import { useState } from "react";
import InputForm from "./components/InputForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <InputForm />
    </div>
  );
}

export default App;
