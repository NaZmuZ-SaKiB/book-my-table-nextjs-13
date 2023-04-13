export default function Loading() {
  return (
    <main className="max-w-screen-2xl m-auto">
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <div>
            <p className="animate-pulse w-[200px] bg-gray-300 rounded-full h-4"></p>
            <div className="mt-5 flex">
              <div className="animate-pulse bg-gray-300 w-32 h-22 rounded" />
              <div className="ml-4">
                <p className="animate-pulse w-[350px] bg-gray-300 rounded-full h-6"></p>
                <div className="flex mt-3">
                  <p className="mr-6 animate-pulse w-[100px] bg-gray-300 rounded-full h-4"></p>
                  <p className="mr-6 animate-pulse w-[100px] bg-gray-300 rounded-full h-4"></p>
                  <p className="mr-6 animate-pulse w-[100px] bg-gray-300 rounded-full h-4"></p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-between w-[660px]">
            <div className="animate-pulse bg-gray-300 rounded p-3 w-80 mb-4 h-12" />
            <div className="animate-pulse bg-gray-300 rounded p-3 w-80 mb-4 h-12" />
            <div className="animate-pulse bg-gray-300 rounded p-3 w-80 mb-4 h-12" />
            <div className="animate-pulse bg-gray-300 rounded p-3 w-80 mb-4 h-12" />
            <div className="animate-pulse bg-gray-300 rounded p-3 w-80 mb-4 h-12" />
            <div className="animate-pulse bg-gray-300 rounded p-3 w-80 mb-4 h-12" />
            <button className="animate-pulse bg-gray-300 w-full p-3 text-white font-bold rounded disabled:bg-gray-300">
              Complete reservation
            </button>
            <p className="mt-4 text-sm">
              By clicking “Complete reservation” you agree to the BookMyTable
              Terms of Use and Privacy Policy. Standard text message rates may
              apply. You may opt out of receiving text messages at any time.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
