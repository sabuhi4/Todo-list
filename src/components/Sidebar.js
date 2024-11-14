import {
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineFlag,
  AiOutlineInbox,
  AiOutlineSchedule,
} from "react-icons/ai";

function Sidebar() {
  return (
    <div className="w-96 h-screen bg-gray-100 text-white p-4 fixed">
      <div className="grid gap-4">
        <div className=" flex items-center justify-between p-4 rounded-lg shadow bg-blue-300 ">
          <AiOutlineInbox />
          <span>All</span>
          <div>0</div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-red-300 ">
          <AiOutlineCalendar />
          Today
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-yellow-300 ">
          <AiOutlineSchedule />
          Scheduled
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
