// 메인 페이지, 데이터 페칭과 필터링 로직만
import { useEffect, useMemo, useState } from "react";
import { fetchFundamentalsFor } from "../components/service/fundamentalsFetcher";
import type { FundamentalData } from "shared-types/src/fundamentalTypes";
// import type { FilterSetTypes } from "shared-types/src/FilterSetTypes";
import {
  applyFilters,
  type FilterSet,
  type FilterRule,
} from "@/utils/filterEngine";
import { fetchDailyClosePriceFor } from "../components/service/dailyPriceFetcher";
// import { calculateMagicFormula } from "@/utils/magicFormula";

import FundamentalSettings from "./FundamentalSettings";
import FundamentalFilter from "./FundamentalFilter";
// import SearchBar from "./SearchBar"; // Removed
import PredefinedFilterTabs from "./PredefinedFilterTabs";
import StockDataTable from "@/components/StockDataTable";
import { StockRow } from "@/assets/type/type";

// ⛔️ 기존 문자열 파서는 더 이상 사용하지 않으므로 제거
// function parseRangeFilter(...) { ... }

interface StockTableProps {
  searchQuery: string;
}

const StockTable = ({ searchQuery }: StockTableProps) => {
  // const [searchQuery, setSearchQuery] = useState(""); // Lifted to App
  const [tickers, setTickers] = useState<string[]>([]);
  const [fundamentals, setFundamentals] = useState<
    Record<string, FundamentalData>
  >({});
  const [dailyCloses, setDailyCloses] = useState<Record<string, number>>({});

  // 패널 상태 ('none' | 'columns' | 'filters')
  const [activePanel, setActivePanel] = useState<
    "none" | "columns" | "filters"
  >("none");
  const [isLoading, setIsLoading] = useState(true);

  // 필터 기본 상태 (빈 객체 = 필터 없음)
  const initialFilterState: FilterSet = {};

  // 상태: 규칙 객체 기반
  const [fundamentalFilters, setFundamentalFilters] =
    useState<FilterSet>(initialFilterState);

  // 현재 활성화된 프리셋 라벨 (없으면 null)
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // 컬럼 세팅 (표시 컬럼만)
  const [enabledMetrics, setEnabledMetrics] = useState<string[]>([
    "ticker",
    "name",
    "sector",
    "price",
    "marketCap",
    "PER",
    "roe",
    "dividendYield",
    "Week52High",
    "Week52Low",
    "Day200MA",
  ]);

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

  // 숫자/문자 변환 유틸 (제거됨 - View Layer 로 이동)
  // const getNumberOrDash = ...

  // 마법공식 랭킹 계산 (전체 데이터 대상)
  // const magicRanks = useMemo(
  //   () => calculateMagicFormula(fundamentals),
  //   [fundamentals]
  // );

  // 1) 필터 적용
  const filteredTickers = useMemo(() => {
    return tickers.filter((ticker) => {
      const f = fundamentals[ticker];
      if (!f) return false;
      return applyFilters(
        f as unknown as Record<string, unknown>,
        fundamentalFilters,
      );
    });
  }, [tickers, fundamentals, fundamentalFilters]);

  // 2) 표 데이터로 가공
  const allData: StockRow[] = useMemo(() => {
    return filteredTickers.map((ticker) => {
      const f = fundamentals[ticker];
      const closePrice = dailyCloses[ticker];

      // Data Processing Layer: 값 계산만 하고, 포맷팅은 View Layer에게 맡김
      const divYieldVal = f?.dividendYield
        ? (() => {
            const raw =
              typeof f.dividendYield === "number"
                ? f.dividendYield
                : Number(f.dividendYield);
            return Number.isFinite(raw)
              ? Math.floor(raw * 10000) / 100
              : undefined;
          })()
        : undefined;

      // 요약 필드는 여러 정보가 합쳐지므로 여기서 문자열 조합
      const summaryArr = [
        f?.sector ?? "",
        divYieldVal != null ? `배당 ${divYieldVal.toFixed(2)}%` : "",
        f?.EPS != null ? `EPS ${f.EPS.toFixed(2)}` : "",
        f?.PBR != null ? `PBR ${f.PBR.toFixed(2)}` : "",
      ];
      const summary = summaryArr.filter(Boolean).join(" / ");

      // Raw Data 전달
      return {
        ticker,
        name: f?.name ?? "-",
        price: closePrice ?? "-", // 숫자가 없으면 "-"
        marketCap: f?.marketCap ? Number(f.marketCap) : "-",
        volume: f?.volume ? Number(f.volume) : "-",
        PER: f?.PER != null ? f.PER : "-",
        EPS: f?.EPS != null ? f.EPS : "-",
        PBR: f?.PBR != null ? f.PBR : "-",
        dividendYield: divYieldVal ?? "-", // 숫자 혹은 "-"
        summary,
        // Technicals (finviz style)
        Week52High: f?.Week52High,
        Week52Low: f?.Week52Low,
        Day50MA: f?.Day50MA,
        Day200MA: f?.Day200MA,
      };
    });
  }, [filteredTickers, dailyCloses, fundamentals]);

  // 검색(티커/회사명)
  const searchedData = useMemo(() => {
    if (!searchQuery) return allData;
    return allData.filter(
      (item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allData, searchQuery]);

  return (
    <div className="w-full relative flex flex-col">
      {/* 1. 상단 컨트롤 바 (패널이 닫혀있을 때만 표시) */}
      {activePanel === "none" && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            {/* 유명인 필터 (왼쪽/상단) */}
            <div className="flex-1 min-w-0">
              <PredefinedFilterTabs
                activePreset={activePreset}
                onApplyFilter={(presetFilters, label) => {
                  if (activePreset === label) {
                    // 이미 선택된 필터를 다시 누르면 해제(초기화)
                    setFundamentalFilters(initialFilterState);
                    setActivePreset(null);
                  } else {
                    // 새로운 필터 적용
                    setFundamentalFilters({ ...presetFilters });
                    setActivePreset(label);
                  }
                }}
              />
            </div>

            {/* 설정 버튼들 (오른쪽/하단) */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setActivePanel("columns")}
                className="px-4 py-2 bg-[#444466] hover:bg-[#555577] text-gray-200 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >
                ⚙️ 컬럼 설정
              </button>

              <button
                onClick={() => setActivePanel("filters")}
                className="px-4 py-2 bg-[#444466] hover:bg-[#555577] text-gray-200 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >
                🔍 상세 필터
              </button>

              <button
                onClick={() => {
                  setFundamentalFilters(initialFilterState);
                  setActivePreset(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-medium transition-colors"
              >
                ↺ 초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 설정 패널 (활성화 시 상단 영역 대체 및 확장) */}
      {activePanel !== "none" && (
        <div className="mb-6 bg-[#232336] border border-gray-600 rounded-lg shadow-2xl animate-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-600 bg-[#2c2c44] rounded-t-lg">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                {activePanel === "columns"
                  ? "⚙️ 컬럼 표시 설정"
                  : "🔍 상세 필터 조건 설정"}
              </h2>
              <span className="text-sm text-gray-400">
                (설정 후 닫기를 누르세요)
              </span>
            </div>
            <button
              onClick={() => setActivePanel("none")}
              className="flex items-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg"
            >
              <span>설정 완료 (닫기)</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activePanel === "columns" && (
              <FundamentalSettings
                enabledMetrics={enabledMetrics}
                onChange={setEnabledMetrics}
              />
            )}
            {activePanel === "filters" && (
              <FundamentalFilter
                filters={fundamentalFilters}
                onChange={(field, rule?: FilterRule) => {
                  setFundamentalFilters((prev) => {
                    const next = { ...prev };
                    if (rule === undefined) delete next[field];
                    else next[field] = rule;
                    return next;
                  });
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* 3. 데이터 테이블 (항상 존재, 패널에 의해 아래로 밀림) */}
      <div className="flex-1 relative z-0 transition-all duration-300 ease-in-out">
        <StockDataTable
          data={searchedData}
          enabledMetrics={enabledMetrics}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default StockTable;
