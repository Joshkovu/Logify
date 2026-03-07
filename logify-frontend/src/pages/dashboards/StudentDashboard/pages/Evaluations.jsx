const Evaluations = () => {
  return (
    <div className="min-h-screen m-15">
      <div className="flex">
        <div>
          <h1 className="text-2xl font-bold mb-4">Evaluations</h1>
          <p>View your internship evaluations and performance scores</p>
        </div>
      </div>
      <section className="flex mt-4 gap-6">
        <div className="bg-white text-gray-600 w-150 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Current average</h3>
              <div className="flex mt-8 mb-1">
                <p className="text-3xl font-bold text-blue-600">85%</p>
              </div>
              <p>Based on mid-term evaluation</p>
            </div>
          </div>
        </div>
        <div className="bg-white text-gray-600 w-150 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Evaluations</h3>
              <div className="flex mt-8 mb-1">
                <p className="text-3xl font-bold text-black">1/2</p>
              </div>
              <p>Completed evaluations</p>
            </div>
          </div>
        </div>
        <div className="bg-white text-gray-600 w-150 p-6 border border-gray-200 rounded-xl mt-4">
          <div className="flex">
            <div className="text-sm">
              <h3 className="text-lg">Performance</h3>
              <div className="flex mt-8 mb-1">
                <p className="text-3xl font-bold text-green-600">Good</p>
              </div>
              <p>Above expectations</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="flex-col gap-4 bg-white flex flex-col-auto border-gray-200 border p-6 rounded-xl w-full">
          <p className="font-semibold -mb-4">Evaluation History</p>
          <p className="text-gray-600">
            All evaluations conducted during your internship
          </p>
          <div className="flex w-full text-gray-600 text-xs border-gray-200 border rounded-xl p-6">
            <div>
              <p className="font-semibold text-lg text-black">
                {" "}
                Mid-Term Evaluation
              </p>
              <p className="mt-3">Evaluator: Dr. Emily Roberts</p>
              <p className="">February 15, 2026</p>
            </div>
            <div className="ml-auto mt-3.5">
              <p className="text-2xl font-bold text-right text-blue-600">85%</p>
              <p>Completed</p>
            </div>
          </div>
          <div className="flex w-full text-gray-600 text-xs border-gray-200 border rounded-xl p-6">
            <div>
              <p className="font-semibold text-lg text-black">
                {" "}
                Final Evaluation
              </p>
              <p className="mt-3">Evaluator: Pending</p>
              <p className="">Expected: April 12, 2026</p>
            </div>
            <div className="ml-auto mt-3.5">
              <p className="text-lg text-right font-bold text-orange-600">
                Pending
              </p>
              <p>Not yet evaluated</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-4 bg-white">
        <div className="flex flex-col gap-4 w-full text-gray-600 border border-gray-200 rounded-xl p-6">
          <p className="font-semibold text-black -mb-4">
            Mid-Term Evaluation Breakdown
          </p>
          <p className="">Detailed scores across evaluation criteria</p>
          <div>
            <div className="flex items-baseline">
              <p className="text-sm font-semibold text-black">
                Technical Skills
              </p>
              <p className="ml-4 text-xs">(30% weight)</p>
              <p className="ml-auto font-bold text-black">88%</p>
            </div>
            <hr className="mb-4">
              {/*placehoder for a progressbar (Currently a line for visibility purposes)*/}
            </hr>
          </div>
          <div>
            <div className="flex items-baseline">
              <p className="text-sm font-semibold text-black">Communication</p>
              <p className="ml-4 text-xs">(20% weight)</p>
              <p className="ml-auto font-bold text-black">85%</p>
            </div>
            <hr className="mb-4">
              {/*placehoder for a progressbar (Currently a line for visibility purposes)*/}
            </hr>
          </div>
          <div>
            <div className="flex items-baseline">
              <p className="text-sm font-semibold text-black">
                Professionalism
              </p>
              <p className="ml-4 text-xs">(20% weight)</p>
              <p className="ml-auto font-bold text-black">90%</p>
            </div>
            <hr className="mb-4">
              {/*placehoder for a progressbar (Currently a line for visibility purposes)*/}
            </hr>
          </div>
          <div>
            <div className="flex items-baseline">
              <p className="text-sm font-semibold text-black">Initiative</p>
              <p className="ml-4 text-xs">(15% weight)</p>
              <p className="ml-auto font-bold text-black">82%</p>
            </div>
            <hr className="mb-4">
              {/*placehoder for a progressbar (Currently a line for visibility purposes)*/}
            </hr>
          </div>
          <div>
            <div className="flex items-baseline">
              <p className="text-sm font-semibold text-black">
                Problem Solving
              </p>
              <p className="ml-4 text-xs">(15% weight)</p>
              <p className="ml-auto font-bold text-black">85%</p>
            </div>
            <hr className="mb-4">
              {/*placehoder for a progressbar (Currently a line for visibility purposes)*/}
            </hr>
          </div>
          <div className="flex">
            <p className="text-black font-semibold">Overall Score</p>
            <p className="text-blue-600 font-bold text-2xl ml-auto">85%</p>
          </div>
        </div>
      </section>
      <section className="mt-4 bg-white">
        <div className="flex flex-col gap-4 w-full text-gray-600 border border-gray-200 rounded-xl p-6">
          <p className="font-semibold text-black -mb-4">Supervisor Comments</p>
          <p className="">Feedback from your academic supervisor</p>
          <div className="text-gray-600 bg-gray-100 w-full rounded-xl p-6">
            <div className="flex mb-2">
              <div>
                <p className="text-black font-semibold">Dr. Emily Roberts</p>
                <p className="text-sm">Academic Supervisor</p>
              </div>
              <p className="ml-auto text-xs">February 15, 2026</p>
            </div>
            <p className="text-sm">
              &quot;Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Recusandae nihil amet rem qui eos optio facere quaerat dignissimos
              voluptates ut labore culpa facilis magnam rerum nostrum, hic,
              praesentium neque omnis.&quot;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evaluations;
