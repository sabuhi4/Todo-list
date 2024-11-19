import { AiOutlineCloudSync } from "react-icons/ai";
import { supabase } from "../services/supabaseClient";

function TaskForm({
  setItems,
  context,
  setContext,
  priority,
  setPriority,
  flagged,
  setFlagged,
}) {
  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (context.trim() === "") {
      console.error("Context is empty. Please enter a task context.");
      return;
    }

    try {
      // Insert the new task
      const { data, error } = await supabase
        .from("Todo-list")
        .insert([{ checked: false, context, priority, flagged }])
        .select();

      if (error) {
        console.error("Error inserting data:", error.message);
      } else if (data) {
        // Fetch updated task list from Supabase
        const { data: updatedItems, error: fetchError } = await supabase
          .from("Todo-list")
          .select();

        if (fetchError) {
          console.error("Error fetching updated tasks:", fetchError.message);
        } else {
          setItems(updatedItems); // Replace local state with the fresh list
        }
      }

      // Reset form inputs
      setContext("");
      setPriority("Low");
      setFlagged(false);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }
  return (
    <form
      className="bg-white p-6 rounded-lg shadow-md w-full  "
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
        className="w-15 p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="checkbox"
        checked={flagged}
        onChange={(e) => setFlagged(e.target.checked)}
        className=" m-5 mr-2 cursor-pointer"
      />
      <label className="text-gray-700">Flag Task</label>

      {/* Button to Submit Form */}
      <button
        type="submit"
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
      >
        <AiOutlineCloudSync className="text-2xl" />
        Sync
      </button>
    </form>
  );
}

export default TaskForm;
