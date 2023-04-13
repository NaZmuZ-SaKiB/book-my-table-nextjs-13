import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-[#0f1f47] to-[#5f6984] px-2 py-10 pt-12 sm:pt-16 md:py-18 md:pt-24">
      <div className="text-center">
        <h1 className="text-white text-2xl text-medium sm:text-3xl md:text-5xl md:font-bold mb-2">
          Find your table for any occasion
        </h1>
        <SearchBar />
      </div>
    </div>
  );
}
