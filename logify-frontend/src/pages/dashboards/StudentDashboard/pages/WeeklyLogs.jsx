import { useState } from "react";
import CreateWeeklyLog from "../CreateWeeklyLog";
const WeeklyLogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen m-15">
      <div className="flex">
        <div>
          <h1 className="text-2xl font-bold mb-4">Weekly Logs</h1>
          <p>Track your internship progress week by week</p>
        </div>
        <div className="ml-auto mt-2.5">
          <button
            className="hover:bg-blue-700 transition-colors p-2 font-semibold text-white bg-blue-600 rounded-md text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Log
          </button>
          <CreateWeeklyLog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>

      <section className="flex mt-4">
        <div className="bg-white p-6 border border-gray-200 rounded-xl w-full">
          <div className="mb-6">
            <p className="font-semibold">Log History</p>
            <p className="text-gray-600">All your submitted weekly logs</p>
          </div>
          <div className="text-sm">
            <div>
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week</p>
                <p className="flex-1 font-semibold">Date Range</p>
                <p className="flex-1 font-semibold">Status</p>
                <p className="flex-1 font-semibold">Submitted On</p>
                <p className="flex-1 font-semibold">Actions</p>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 8</p>
                <p className="flex-1">Feb 17 - Feb 23</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Feb 23,2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 7</p>
                <p className="flex-1">Feb 10 - Feb 16</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Feb 16, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 6</p>
                <p className="flex-1">Feb 3 - Feb 9</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Feb 9, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 5</p>
                <p className="flex-1">Jan 27 - Feb 2</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Feb 2, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 4</p>
                <p className="flex-1">Jan 20 - Jan 26</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Jan 26, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 3</p>
                <p className="flex-1">Jan 13 - Jan 19</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Jan 19, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 2</p>
                <p className="flex-1">Jan 6 - Jan 12</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Jan 12, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
              <hr className="mt-5 mb-4 border-gray-200" />
              <div className="flex gap-4">
                <p className="flex-1 font-semibold">Week 1</p>
                <p className="flex-1">Dec 30 - Jan 5</p>
                <div className="flex-1">
                  <span className="text-xs text-green-700 bg-green-200 shadow p-0.5 pl-3 pr-3 rounded-2xl">
                    APPROVED
                  </span>
                </div>
                <p className="text-gray-600 flex-1">Jan 5, 2026</p>
                <div className="flex-1">
                  <span className=" hover:bg-gray-300 transition-colors rounded-md p-2 font-semibold">
                    View
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex mt-4 gap-6">
        <div className="bg-white text-gray-600 w-150 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Total Logs</h3>
              <div className="flex mt-8 mb-1">
                <p className="text-3xl font-bold text-black">8</p>
              </div>
              <p>Submitted logs</p>
            </div>
          </div>
        </div>
        <div className="bg-white text-gray-600 w-150 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Approved</h3>
              <div className="flex mt-8 mb-1">
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <p>Successfully approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white text-gray-600 w-150 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Approval Rate</h3>
              <div className="flex mt-8 mb-1">
                <p className="text-3xl font-bold text-blue-600">100%</p>
              </div>
              <p>Of submitted logs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeeklyLogs;
