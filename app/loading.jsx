import Header from "@/components/Header";

export default function Loading() {
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {Array(12)
          .fill()
          .map((a, i) => (
            <div
              className="animate-pulse m-3 bg-slate-200 w-64 h-72 rounded overflow-hidden border cursor-pointer"
              key={i + "loading"}
            ></div>
          ))}
      </div>
    </main>
  );
}
