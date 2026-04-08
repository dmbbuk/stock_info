import { Dispatch, SetStateAction } from 'react';
import SearchBar from '../../pages/SearchBar';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

export const Header = ({ searchQuery, setSearchQuery }: HeaderProps) => {
  return (
    <header className="flex items-center gap-4 h-11 px-4 bg-[#141414] border-b border-[#2a2a2a] flex-shrink-0">
      <span className="text-sm font-bold tracking-widest whitespace-nowrap select-none">
        <span className="text-blue-400">STOCK</span>
        <span className="text-white">SCREENER</span>
      </span>
      <div className="w-60">
        <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
      </div>
    </header>
  );
};
