import { useState } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");

  return (
    <div className="flex">
      <Sidebar items={items} setFilter={setFilter} />
      <Main items={items} setItems={setItems} filter={filter} />
    </div>
  );
}

export default App;
