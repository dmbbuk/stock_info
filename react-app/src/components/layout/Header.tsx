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
        <div className="flex-1 min-w-0 pr-4 flex flex-col md:h-[90px] md:justify-between gap-4 md:gap-0">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
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
