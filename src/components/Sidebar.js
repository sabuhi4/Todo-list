import {
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineFlag,
  AiOutlineInbox,
} from "react-icons/ai";

function Sidebar({ items, setFilter }) {
  function getTodayTasks(items) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return items.filter(
      (item) => new Date(item.created_at).getTime() >= todayStart
    );
  }
  const todayTasks = getTodayTasks(items);
  const flaggedTasks = items.filter((item) => item.flagged).length;
  const completedTasks = items.filter((item) => item.checked).length;

  return (
    <div className=" border-r-2 w-96 h-screen bg-gray-200 text-white p-4 fixed">
      <div className="grid gap-4 ">
        <div
          className=" flex items-center justify-between p-4 rounded-lg shadow bg-blue-300 cursor-pointer"
          onClick={() => setFilter("All")}
        >
          <AiOutlineInbox />
          <span>All</span>
          <div>{items.length}</div>
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-lg shadow bg-red-300 cursor-pointer "
          onClick={() => setFilter("Today")}
        >
          <AiOutlineCalendar />
          <span>Today</span>
          <div>{todayTasks.length}</div>
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-lg shadow bg-gray-700 cursor-pointer "
          onClick={() => setFilter("Flagged")}
        >
          <AiOutlineFlag />
          Flagged
          <div>{flaggedTasks}</div>
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-lg shadow bg-green-300 cursor-pointer "
          onClick={() => setFilter("Completed")}
        >
          <AiOutlineCheckCircle />
          Completed
          <div>{completedTasks}</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
