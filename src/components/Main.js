import {
  AiOutlineCloudSync,
  AiOutlinePlus,
  AiOutlineDelete,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function Main() {
  const [items, setItems] = useState([]);
  const [context, setContext] = useState("");
  const [priority, setPriority] = useState("Low");

  // Fetch data from Supabase
  async function fetchItems() {
    try {
      const { data, error } = await supabase.from("Todo-list").select("*");

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        setItems(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (context.trim() === "") {
      console.error("Context is empty. Please enter a task context.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Todo-list")
        .insert([{ checked: false, context, priority }]);

      if (error) {
        console.error("Error inserting data:", error.message);
      } else {
        setItems((prevItems) => [...prevItems, ...data]);
        setContext("");
        setPriority("Low");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  // Handle deleting an item
  async function handleDelete(id) {
    try {
      const { error } = await supabase.from("Todo-list").delete().eq("id", id);

      if (error) {
        console.error("Error deleting item:", error.message);
      } else {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  // Handle toggling the completion status
  async function handleToggleChecked(id, currentChecked) {
    try {
      const { error } = await supabase
        .from("Todo-list")
        .update({ checked: !currentChecked })
        .eq("id", id);

      if (error) {
        console.error("Error updating item:", error.message);
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, checked: !currentChecked } : item
          )
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Add a Task</h2>

        {/* Input for Context */}
        <input
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Task context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />

        {/* Select for Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Button to Submit Form */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
        >
          <AiOutlineCloudSync className="text-2xl" />
          Sync
        </button>
      </form>

      {/* Display the Fetched Items */}
      <div className="w-full max-w-md bg-white mt-6 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Todo List</h2>
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-2 flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {/* Checkbox for Completion */}
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleChecked(item.id, item.checked)}
                  className="cursor-pointer"
                />
                <div>
                  <strong
                    className={`${
                      item.checked
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {item.context}
                  </strong>
                  {" - "}
                  <span
                    className={`${
                      item.priority === "High"
                        ? "text-red-600"
                        : item.priority === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    } font-semibold`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <AiOutlineDelete className="text-2xl" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Main;
