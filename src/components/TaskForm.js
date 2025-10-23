import { AiOutlineCloudSync } from "react-icons/ai";
import { supabase } from "../services/supabaseClient";
import { useState } from "react";

function TaskForm({
  setItems,
  context,
  setContext,
  priority,
  setPriority,
  flagged,
  setFlagged,
  dueDate,
  setDueDate,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (context.trim() === "") {
      setError("Please enter a task description.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { data, error } = await supabase
        .from("Todo-list")
        .insert([
          { checked: false, context, priority, flagged, due_date: dueDate },
        ])
        .select();

      if (error) {
        setError("Failed to add task. Please try again.");
        console.error("Error inserting data:", error.message);
      } else if (data) {
        const { data: updatedItems, error: fetchError } = await supabase
          .from("Todo-list")
          .select();

        if (fetchError) {
          setError("Task added but failed to refresh list.");
          console.error("Error fetching updated tasks:", fetchError.message);
        } else {
          setItems(updatedItems);
          setSuccess(true);

          setContext("");
          setPriority("Low");
          setFlagged(false);
          setDueDate(null);

          setTimeout(() => setSuccess(false), 3000);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full transition-colors"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Add a Task</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
          Task added successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <input
        className="w-full p-2 mb-4 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        type="text"
        placeholder="Task context"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        disabled={loading}
      />
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full sm:w-auto p-2 mb-4 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={loading}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={dueDate || ""}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full sm:w-auto p-2 mb-4 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={loading}
        />
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={flagged}
            onChange={(e) => setFlagged(e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-blue-500"
            disabled={loading}
          />
          <label className="text-gray-700 dark:text-gray-300">Flag Task</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <AiOutlineCloudSync className={`text-2xl ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Adding...' : 'Sync'}
      </button>
    </form>
  );
}

export default TaskForm;
