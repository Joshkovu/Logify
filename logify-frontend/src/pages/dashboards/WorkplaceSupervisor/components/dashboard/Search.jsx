import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
  return (
    <>
      <div className="bg-stone-200 relative rounded-xl flex items-center px-2 py-1.5 text-sm dark:bg-slate-700/50 dark:text-slate-300">
        <IoSearchOutline className="mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent placeholder:text-stone-400 focus:outline-none"
        />
      </div>
    </>
  );
};

export default Search;
