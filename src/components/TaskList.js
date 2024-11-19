import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMiniFlag } from "react-icons/hi2";
import { supabase } from "../services/supabaseClient";

function TaskList({ items, setItems, filter }) {
  const [sortOrder, setSortOrder] = useState("Newest");

  const filteredItems = items
    .filter((item) => {
      switch (filter) {
        case "Today":
          const todayStart = new Date().setHours(0, 0, 0, 0);
          return new Date(item.created_at).getTime() >= todayStart;
        case "Flagged":
          return item.flagged;
        case "Completed":
          return item.checked;
        case "All":
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sorting logic based on sortOrder
      switch (sortOrder) {
        case "Newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "Oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "Priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  // Handle deleting an item
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

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
    <div className="w-full  bg-white mt-6 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Todo List</h2>
      <div className="flex justify-end mb-4 gap-2">
        {/* Sort Order Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Priority">Priority</option>
        </select>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredItems.map((item) => (
          <li key={item.id} className="py-2 flex justify-between items-center">
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
                <span>
                  {item.flagged && <HiMiniFlag className="text-red-500" />}
                </span>
                {/* Display the created_at date */}
                <div className=" text-gray-500 text-sm">
                  Created at: {new Date(item.created_at).toLocaleString()}
                </div>
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
  );
}

export default TaskList;
