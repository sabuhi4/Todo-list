import { useState } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";

function App() {
  const [items, setItems] = useState([]);

  return (
    <div flex>
      <Sidebar allTaskCount={items.length} />
      <Main items={items} setItems={setItems} />
    </div>
  );
}

export default App;
