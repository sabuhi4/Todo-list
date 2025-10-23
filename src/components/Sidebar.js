import {
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineFlag,
  AiOutlineInbox,
  AiOutlineClose,
} from "react-icons/ai";

function Sidebar({ items, setFilter, sidebarOpen, setSidebarOpen, darkMode }) {
  function getTodayTasks(items) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return items.filter(
      (item) => new Date(item.created_at).getTime() >= todayStart
    );
  }
  const todayTasks = getTodayTasks(items);
  const flaggedTasks = items.filter((item) => item.flagged).length;
  const completedTasks = items.filter((item) => item.checked).length;

  const handleFilterClick = (filterName) => {
    setFilter(filterName);
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
          fixed lg:static
          top-0 left-0
          h-screen w-80 lg:w-96
          bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white p-4
          border-r-2 dark:border-gray-700
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          z-50
        `}
      >
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-1 rounded transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <AiOutlineClose size={24} />
        </button>

        <div className="grid gap-4 mt-12 lg:mt-0">
          <div
            className="flex items-center justify-between p-4 rounded-lg shadow bg-blue-500 dark:bg-blue-600 text-white cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            onClick={() => handleFilterClick("All")}
          >
            <AiOutlineInbox />
            <span>All</span>
            <div>{items.length}</div>
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-lg shadow bg-red-500 dark:bg-red-600 text-white cursor-pointer hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            onClick={() => handleFilterClick("Today")}
          >
            <AiOutlineCalendar />
            <span>Today</span>
            <div>{todayTasks.length}</div>
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-lg shadow bg-gray-700 dark:bg-gray-600 text-white cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleFilterClick("Flagged")}
          >
            <AiOutlineFlag />
            Flagged
            <div>{flaggedTasks}</div>
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-lg shadow bg-green-500 dark:bg-green-600 text-white cursor-pointer hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            onClick={() => handleFilterClick("Completed")}
          >
            <AiOutlineCheckCircle />
            Completed
            <div>{completedTasks}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
