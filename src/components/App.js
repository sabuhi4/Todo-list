import { useState, useEffect } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full transition-colors duration-200">
        <Sidebar
          items={items}
          setFilter={setFilter}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
        />
        <Main
          items={items}
          setItems={setItems}
          filter={filter}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    </div>
  );
}

export default App;
