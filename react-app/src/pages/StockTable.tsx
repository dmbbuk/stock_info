// 메인 페이지, 데이터 페칭과 필터링 로직만
import { useEffect, useMemo, useState } from "react";
import { fetchFundamentalsFor } from "../components/service/fundamentalsFetcher";
import type { FundamentalData } from "shared-types/src/fundamentalTypes";
import {
  applyFilters,
  type FilterSet,
  type FilterRule,
} from "@/utils/filterEngine";
import { fetchDailyClosePriceFor } from "../components/service/dailyPriceFetcher";

import FundamentalSettings from "./FundamentalSettings";
import FundamentalFilter from "./FundamentalFilter";
import PredefinedFilterTabs from "./PredefinedFilterTabs";
import StockDataTable from "@/components/StockDataTable";
import { StockRow } from "@/assets/type/type";

interface StockTableProps {
  searchQuery: string;
}

// ----- View Tab 정의 -----
type ViewTab = "overview" | "valuation" | "financial" | "technical" | "custom";

const VIEW_PRESETS: Record<ViewTab, { label: string; metrics: string[] | null }> = {
  overview: {
    label: "Overview",
    metrics: ["ticker", "name", "sector", "price", "marketCap", "PER", "roe", "dividendYield", "Week52High", "Week52Low", "Day200MA"],
  },
  valuation: {
    label: "Valuation",
    metrics: ["ticker", "name", "PER", "PBR", "PEG", "EPS", "evEbitda", "dividendYield"],
  },
  financial: {
    label: "Financial",
    metrics: ["ticker", "name", "marketCap", "revenueGrowth", "epsGrowth", "operatingMargin", "profitMargin", "roe"],
  },
  technical: {
    label: "Technical",
    metrics: ["ticker", "name", "price", "volume", "Week52High", "Week52Low", "Day200MA"],
  },
  custom: {
    label: "Custom",
    metrics: null,
  },
};

const StockTable = ({ searchQuery }: StockTableProps) => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [fundamentals, setFundamentals] = useState<Record<string, FundamentalData>>({});
  const [dailyCloses, setDailyCloses] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const initialFilterState: FilterSet = {};
  const [fundamentalFilters, setFundamentalFilters] = useState<FilterSet>(initialFilterState);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // View Tab 상태
  const [activeView, setActiveView] = useState<ViewTab>("overview");

  // Custom 탭 전용 컬럼 설정
  const [customMetrics, setCustomMetrics] = useState<string[]>([
    "ticker", "name", "sector", "price", "marketCap", "PER", "roe", "dividendYield", "Week52High", "Week52Low", "Day200MA",
  ]);

  // 현재 활성 컬럼 목록 (탭에서 파생)
  const enabledMetrics = useMemo(() => {
    if (activeView === "custom") return customMetrics;
    return VIEW_PRESETS[activeView].metrics ?? customMetrics;
  }, [activeView, customMetrics]);

  // 최초 마운트 시 fundamentals 전체 fetch
  useEffect(() => {
    const fetchAllFundamentals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFundamentalsFor();
        setFundamentals(data);
        setTickers(Object.keys(data));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllFundamentals();
  }, []);

  // 종가 fetch
  useEffect(() => {
    if (tickers.length === 0) return;
    const loadDailyCloses = async () => {
      const closes = await fetchDailyClosePriceFor(tickers);
      setDailyCloses(closes);
    };
    loadDailyCloses();
  }, [tickers]);

  // 1) 필터 적용
  const filteredTickers = useMemo(() => {
    return tickers.filter((ticker) => {
      const f = fundamentals[ticker];
      if (!f) return false;
      return applyFilters(f as unknown as Record<string, unknown>, fundamentalFilters);
    });
  }, [tickers, fundamentals, fundamentalFilters]);

  // 2) 표 데이터로 가공
  const allData: StockRow[] = useMemo(() => {
    return filteredTickers.map((ticker) => {
      const f = fundamentals[ticker];
      const closePrice = dailyCloses[ticker];

      const divYieldVal = f?.dividendYield
        ? (() => {
            const raw = typeof f.dividendYield === "number" ? f.dividendYield : Number(f.dividendYield);
            return Number.isFinite(raw) ? Math.floor(raw * 10000) / 100 : undefined;
          })()
        : undefined;

      const summaryArr = [
        f?.sector ?? "",
        divYieldVal != null ? `배당 ${divYieldVal.toFixed(2)}%` : "",
        f?.EPS != null ? `EPS ${f.EPS.toFixed(2)}` : "",
        f?.PBR != null ? `PBR ${f.PBR.toFixed(2)}` : "",
      ];
      const summary = summaryArr.filter(Boolean).join(" / ");

      return {
        ticker,
        name: f?.name ?? "-",
        price: closePrice ?? "-",
        marketCap: f?.marketCap ? Number(f.marketCap) : "-",
        volume: f?.volume ? Number(f.volume) : "-",
        PER: f?.PER != null ? f.PER : "-",
        EPS: f?.EPS != null ? f.EPS : "-",
        PBR: f?.PBR != null ? f.PBR : "-",
        dividendYield: divYieldVal ?? "-",
        summary,
        Week52High: f?.Week52High,
        Week52Low: f?.Week52Low,
        Day50MA: f?.Day50MA,
        Day200MA: f?.Day200MA,
      };
    });
  }, [filteredTickers, dailyCloses, fundamentals]);

  // 3) 검색 적용
  const searchedData = useMemo(() => {
    if (!searchQuery) return allData;
    return allData.filter(
      (item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allData, searchQuery]);

  const handleReset = () => {
    setFundamentalFilters(initialFilterState);
    setActivePreset(null);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. 필터 그리드 - 항상 노출 (Finviz 스타일) */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-t-md">
        <FundamentalFilter
          filters={fundamentalFilters}
          onChange={(field, rule) => {
            setFundamentalFilters((prev) => {
              const next = { ...prev };
              if (rule === undefined) delete next[field];
              else next[field] = rule;
              return next;
            });
          }}
          compact
        />
      </div>

      {/* 2. 컨트롤 바: 프리셋(좌) | 뷰탭 + 리셋(우) */}
      <div className="bg-[#111] border-x border-b border-[#2a2a2a] rounded-b-md flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 mb-2">
        {/* 좌: 유명 투자자 프리셋 */}
        <PredefinedFilterTabs
          activePreset={activePreset}
          onApplyFilter={(presetFilters, label) => {
            if (activePreset === label) {
              setFundamentalFilters(initialFilterState);
              setActivePreset(null);
            } else {
              setFundamentalFilters({ ...presetFilters });
              setActivePreset(label);
            }
          }}
        />

        {/* 우: 뷰 탭 + 리셋 버튼 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex border border-[#2a2a2a] rounded overflow-hidden">
            {(Object.keys(VIEW_PRESETS) as ViewTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveView(tab)}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  activeView === tab
                    ? "bg-blue-600 text-white"
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#252525]"
                }`}
              >
                {VIEW_PRESETS[tab].label}
              </button>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 text-xs text-gray-500 border border-[#2a2a2a] rounded hover:text-white hover:border-gray-500 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3. Custom 탭 활성 시 컬럼 선택 UI 표시 */}
      {activeView === "custom" && (
        <div className="mb-2 bg-[#141414] border border-[#2a2a2a] rounded-md p-3">
          <FundamentalSettings enabledMetrics={customMetrics} onChange={setCustomMetrics} />
        </div>
      )}

      {/* 4. 결과 카운트 */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs text-gray-600">
          {isLoading ? "Loading..." : `${searchedData.length.toLocaleString()} results`}
        </span>
      </div>

      {/* 5. 데이터 테이블 */}
      <StockDataTable
        data={searchedData}
        enabledMetrics={enabledMetrics}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StockTable;
