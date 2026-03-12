import { Eye, Mail, Phone } from "lucide-react";

const Intern_details = () => {
  return (
    <div className=" mt-3 p-6 border border-stone-300 col-span-12 rounded-lg bg-white">
      <div className=" w-full flex justify-between items-center">
        <div className=" flex ">
          <img
            src="https://api.dicebear.com/9.x/notionists/svg"
            alt="avatar"
            className="size-18 rounded-full shrink-0 bg-maroonCustom shadow"
          />
          <div className="mx-3 mt-3">
            <h1 className="font-bold text-xl">Sarah Johnson</h1>
            <h2 className="text-lg text-gray-500">Software Engineering</h2>
          </div>
        </div>
        <button className="flex p-1.5 border border-stone-200 rounded-lg">
          <Eye className="size-5" />
          <p className="ml-1 text-sm font-bold text-gray-700">View Details</p>
        </button>
      </div>
      <div className="grid grid-cols-12 mt-6">
        <div className="flex col-span-12 justify-evenly items-start">
          <div className=" w-full">
            <h1 className="text-sm font-medium text-gray-500">University</h1>
            <h2 className="font-bold ">University Of Techonlogy</h2>
          </div>
          <div className=" w-full">
            <h1 className="text-sm font-medium text-gray-500">Start Date</h1>
            <h2 className="font-bold ">January 15, 2026</h2>
          </div>
          <div className=" w-full">
            <h1 className="text-sm font-medium text-gray-500">Performance</h1>
            <h2 className="font-bold text-emerald-500">Excellent</h2>
          </div>
        </div>
        <div className="flex col-span-12 justify-evenly items-start mt-6">
          <div className="flex w-full items-center">
            <Mail className="size-4 text-gray-500"/>
            <p className="text-gray-500 text-sm font-medium ml-1.5">
              sarah.johnson@university.edu
            </p>
          </div>
          <div className="flex w-full items-center">
            <Phone className="size-4 text-gray-500"/>
            <p className="text-gray-500 text-sm font-medium ml-1.5">
              +1 (555) 234-5678
            </p>
          </div>
        </div>
        <div className="flex col-span-12 justify-between mt-6 ">
            <p className="text-sm text-gray-500 ">Internship Progress</p>
            <p className="text-sm text-gray-700 font-medium">Week 8 of 12</p>
        </div>
        <div className="col-span-12 my-3 h-2 bg-red-50 w-full rounded-full">
            <div className="h-full bg-maroonCustom rounded-l-full w-8/12" ></div>
        </div>
        <div className="flex col-span-12 justify-between ">
            <p className="text-xs text-gray-500 ">8 logs approved</p>
            <p className="text-xs text-gray-700 ">4 weeks remaining</p>
        </div>
      </div>
    </div>
  );
};

export default Intern_details;
