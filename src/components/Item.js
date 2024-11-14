function Item({ checked, onChange }) {
  return (
    <div className=" ml-96 p-4 items-center space-x-2">
      <input
        type="checkbox"
        value={checked}
        className=" w-5 h-5 appearance-none rounded-full border-2 border-gray-300 text-blue-600 checked:bg-blue-500 focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder=""
        type="text"
        className="border-b-2 border-gray-400 focus:border-blue-400 outline-none p-2 w-5/6"
      />
      <select className="inline-block rounded-full border text-sm">
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>
  );
}

export default Item;
