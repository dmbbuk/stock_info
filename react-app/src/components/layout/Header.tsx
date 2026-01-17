import { Dispatch, SetStateAction } from 'react';
import SearchBar from '../../pages/SearchBar';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

export const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  return (
    <header className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Title & Search Section */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex-shrink-0 pt-2 mb-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              실시간 주식 데이터
            </h1>
          </div>
          
          <div className="w-full max-w-md">
            <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Advertisement Section (Right side) */}
        <div className="w-full md:w-[728px] h-[90px] bg-[#232336] rounded-lg border border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 text-sm gap-1 flex-shrink-0">
          <span className="font-semibold">ADVERTISEMENT</span>
          <span className="text-xs">배너 광고 (728x90)</span>
        </div>
      </div>
    </header>
  );
};
