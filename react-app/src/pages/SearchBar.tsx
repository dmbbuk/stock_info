// src/pages/SearchBar.tsx

type Props = {
  searchQuery: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ searchQuery, onChange }: Props) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
        placeholder="티커 검색 (예: AAPL, TSLA)"
        className="w-full px-3 py-2 bg-[#2A2A40] text-white border border-[#444] rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>
  );
}
