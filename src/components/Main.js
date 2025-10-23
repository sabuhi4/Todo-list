import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { AiOutlineMenu } from "react-icons/ai";
import { HiMoon, HiSun } from "react-icons/hi";

function Main({ items, setItems, filter, setFilter, setSidebarOpen, darkMode, setDarkMode }) {
  const [context, setContext] = useState("");
  const [priority, setPriority] = useState("Low");
  const [flagged, setFlagged] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("Todo-list").select("*");

      if (error) {
        setError("Failed to load tasks. Please try again.");
        console.error("Error fetching data:", error.message);
      } else if (data && Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }, [setItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="flex-1 w-full p-4 md:p-6 lg:ml-0">
      <button
        className="lg:hidden fixed top-4 left-4 z-30 bg-blue-500 dark:bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <AiOutlineMenu size={24} />
      </button>

      <button
        className="fixed top-4 right-4 lg:top-6 lg:right-6 z-30 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 p-3 rounded-lg shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
      </button>

      <div className="max-w-4xl mx-auto mt-16 lg:mt-0">
        <TaskForm
          setItems={setItems}
          context={context}
          setContext={setContext}
          priority={priority}
          setPriority={setPriority}
          flagged={flagged}
          setFlagged={setFlagged}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          <TaskList
            items={items}
            setItems={setItems}
            filter={filter}
            setFilter={setFilter}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />
        )}
      </div>
    </div>
  );
}

export default Main;
