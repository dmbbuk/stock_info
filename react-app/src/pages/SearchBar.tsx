// src/pages/SearchBar.tsx

type Props = {
  searchQuery: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ searchQuery, onChange }: Props) {
  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ticker search... (AAPL, TSLA)"
      className="w-full h-7 px-2.5 text-xs bg-[#222] text-white border border-[#3a3a3a] rounded focus:outline-none focus:border-blue-500 placeholder-gray-600"
    />
  );
}
