import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { HiMiniFlag } from "react-icons/hi2";
import { supabase } from "../services/supabaseClient";

function TaskList({ items, setItems, filter }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState({
    context: "",
    priority: "Low",
    flagged: false,
  });

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
    .filter((item) =>
      // Apply search filter
      item.context.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
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

  // Handle Editing Task
  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("Todo-list")
        .update(editTask)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating item:", error.message);
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingId ? { ...item, ...editTask } : item
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

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
    <div className="w-full bg-white mt-6 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Todo List</h2>
      <div className="flex justify-between mb-4 gap-2">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for tasks"
          className="p-2 w-1/2 rounded-md border"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
          <li key={item.id} className="py-2">
            {/* Parent flex container to separate content and buttons */}
            <div className="flex justify-between items-center">
              {/* Left content (Task Information) */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleChecked(item.id, item.checked)}
                  className="cursor-pointer"
                />
                {editingId === item.id ? (
                  <form onSubmit={handleEditSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={editTask.context}
                      onChange={(e) =>
                        setEditTask({ ...editTask, context: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                    <select
                      value={editTask.priority}
                      onChange={(e) =>
                        setEditTask({ ...editTask, priority: e.target.value })
                      }
                      className="border p-1 rounded"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <input
                      type="checkbox"
                      checked={editTask.flagged}
                      onChange={(e) =>
                        setEditTask({ ...editTask, flagged: e.target.checked })
                      }
                      className="cursor-pointer"
                    />
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-2 rounded"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div>
                      <strong
                        className={`${
                          item.checked
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {item.context}
                      </strong>{" "}
                      -{" "}
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
                      {item.flagged && <HiMiniFlag className="text-red-500" />}
                      <div className="text-sm text-gray-500">
                        Created at: {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right buttons container */}
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setEditTask({
                      context: item.context,
                      priority: item.priority,
                      flagged: item.flagged,
                    });
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <AiOutlineEdit className="text-2xl" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete className="text-2xl" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
