import { motion } from "framer-motion";
import React from "react";

const GroupSearch = ({ searchValue, setSearchValue, sort, setSort }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">

        <div className="flex-1 w-full">
          <label htmlFor="group-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Groups
          </label>
          <div className="relative">
            <input
              id="group-search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name or institute..."
              className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

      
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
            Sort by:
          </label>
          <motion.select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMTIgOCI+PHBhdGggZmlsbD0iIzY2NyIgZD0iTTAuODU0IDQuODU0TDEuNzA3IDQuMDAyTDYuMDAxIDguMjk3bDQuMjk4LTQuMjk1bDAuODU0IDAuODU0TDMuNDQ5IDguNTk5eiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <option value="desc">Latest First</option>
            <option value="asc">Oldest First</option>
          </motion.select>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupSearch;