import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { HiMiniFlag } from "react-icons/hi2";
import { supabase } from "../services/supabaseClient";

function TaskList({ items, setItems, filter, dueDate, setDueDate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState({
    context: "",
    priority: "Low",
    flagged: false,
    due_date: null,
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
    <div className="w-full bg-white dark:bg-gray-800 mt-6 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Todo List</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for tasks"
          className="p-2 w-full sm:w-1/2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Priority">Priority</option>
        </select>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredItems.map((item) => (
          <li key={item.id} className="py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleChecked(item.id, item.checked)}
                  className="cursor-pointer"
                />
                {editingId === item.id ? (
                  <form onSubmit={handleEditSubmit} className="flex flex-col md:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={editTask.context}
                      onChange={(e) =>
                        setEditTask({ ...editTask, context: e.target.value })
                      }
                      className="border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex-1 min-w-0"
                    />
                    <select
                      value={editTask.priority}
                      onChange={(e) =>
                        setEditTask({ ...editTask, priority: e.target.value })
                      }
                      className="border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <input
                      type="date"
                      value={editTask.due_date}
                      onChange={(e) =>
                        setEditTask({ ...editTask, due_date: e.target.value })
                      }
                      className="border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <div className="flex gap-2 items-center">
                      <label className="text-gray-700 dark:text-gray-300 text-sm">Flag: </label>
                      <input
                        type="checkbox"
                        checked={editTask.flagged}
                        onChange={(e) =>
                          setEditTask({
                            ...editTask,
                            flagged: e.target.checked,
                          })
                        }
                        className="cursor-pointer w-5 h-5 accent-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div>
                      <strong
                        className={`break-words ${
                          item.checked
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {item.context}
                      </strong>{" "}
                      -{" "}
                      <span
                        className={`${
                          item.priority === "High"
                            ? "text-red-600 dark:text-red-400"
                            : item.priority === "Medium"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                        } font-semibold`}
                      >
                        {item.priority}
                      </span>
                      {item.flagged && <HiMiniFlag className="text-red-500 dark:text-red-400" />}
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col md:flex-row gap-2 md:gap-10">
                        <span className="text-gray-900 dark:text-gray-300">
                          Created:{" "}
                          {new Date(item.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </span>
                        <span className="text-red-400 dark:text-red-300">
                          Due:{" "}
                          {item.due_date
                            ? new Date(item.due_date).toLocaleString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                            : "No due date"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setEditTask({
                      context: item.context,
                      priority: item.priority,
                      flagged: item.flagged,
                      due_date: item.due_date
                        ? item.due_date.split("T")[0]
                        : "",
                    });
                  }}
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <AiOutlineEdit className="text-2xl" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
