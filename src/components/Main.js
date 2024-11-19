import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

function Main({ items, setItems, filter, setFilter }) {
  const [context, setContext] = useState("");
  const [priority, setPriority] = useState("Low");
  const [flagged, setFlagged] = useState(false);

  // Fetch data from Supabase
  const fetchItems = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("Todo-list").select("*");

      if (data && Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Data is not an array:", data);
      }
      if (error) {
        console.error("Error fetching data:", error.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }, [setItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="flex-1 ml-96 p-6">
      <TaskForm
        setItems={setItems}
        context={context}
        setContext={setContext}
        priority={priority}
        setPriority={setPriority}
        flagged={flagged}
        setFlagged={setFlagged}
      />
      <TaskList
        items={items}
        setItems={setItems}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}

export default Main;
