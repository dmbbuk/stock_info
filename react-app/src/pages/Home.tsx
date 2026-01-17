// src/pages/Home.tsx
import StockTable from "./StockTable";

interface HomeProps {
    searchQuery: string;
}

export default function Home({ searchQuery }: HomeProps) {
  return <StockTable searchQuery={searchQuery} />;
}
