import { useState } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";

function App() {
  const [items, setItems] = useState([]);
  const [flagged, setFlagged] = useState(false);

  return (
    <div flex>
      <Sidebar allTaskCount={items.length} items={items} />
      <Main
        items={items}
        setItems={setItems}
        flagged={flagged}
        setFlagged={setFlagged}
      />
    </div>
  );
}

export default App;
