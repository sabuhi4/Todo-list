import {
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineFlag,
  AiOutlineInbox,
} from "react-icons/ai";

function Sidebar({ allTaskCount, items }) {
  function getTodayTasks(items) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return items.filter(
      (item) => new Date(item.created_at).getTime() >= todayStart
    );
  }
  const todayTasks = getTodayTasks(items);

  return (
    <div className=" border-r-2 w-96 h-screen bg-gray-200 text-white p-4 fixed">
      <div className="grid gap-4">
        <div className=" flex items-center justify-between p-4 rounded-lg shadow bg-blue-300 ">
          <AiOutlineInbox />
          <span>All</span>
          <div>{allTaskCount}</div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-red-300 ">
          <AiOutlineCalendar />
          <span>Today</span>
          <div>{todayTasks.length}</div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-gray-700 ">
          <AiOutlineFlag />
          Flagged
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-green-300 ">
          <AiOutlineCheckCircle />
          Completed
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
