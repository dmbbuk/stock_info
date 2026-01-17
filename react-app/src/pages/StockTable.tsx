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
import SearchBar from "./SearchBar";
import PredefinedFilterTabs from "./PredefinedFilterTabs";
import StockDataTable from "@/components/StockDataTable";
import { StockRow } from "@/assets/type/type";

// ⛔️ 기존 문자열 파서는 더 이상 사용하지 않으므로 제거
// function parseRangeFilter(...) { ... }

const StockTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickers, setTickers] = useState<string[]>([]);
  const [fundamentals, setFundamentals] = useState<
    Record<string, FundamentalData>
  >({});
  const [dailyCloses, setDailyCloses] = useState<Record<string, number>>({});
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  // const [activePreset, setActivePreset] = useState<string | null>(null);

  // 필터 기본 상태 (빈 객체 = 필터 없음)
  const initialFilterState: FilterSet = {};

  // 상태: 규칙 객체 기반
  const [fundamentalFilters, setFundamentalFilters] =
    useState<FilterSet>(initialFilterState);

  // 컬럼 세팅 (표시 컬럼만)
  const [enabledMetrics, setEnabledMetrics] = useState<string[]>([
    "ticker",
    "name",
    "price",
    "marketCap",
    "volume",
    "PER",
    "summary",
  ]);

  // 최초 마운트 시 fundamentals 전체 fetch
  useEffect(() => {
    const fetchAllFundamentals = async () => {
      const data = await fetchFundamentalsFor();
      setFundamentals(data);
      setTickers(Object.keys(data));
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

  // 숫자/문자 변환 유틸
  const getNumberOrDash = (val?: number | string, digits = 2, suffix = "") =>
    val != null && val !== ""
      ? typeof val === "number"
        ? val.toFixed(digits) + suffix
        : val
      : "-";

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
        fundamentalFilters
      );
    });
  }, [tickers, fundamentals, fundamentalFilters]);

  // 2) 표 데이터로 가공
  const allData: StockRow[] = useMemo(() => {
    return filteredTickers.map((ticker) => {
      const f = fundamentals[ticker];
      const closePrice = dailyCloses[ticker];
      // const magic = magicRanks[ticker];

      const divYieldVal = f?.dividendYield
        ? (() => {
            const raw =
              typeof f.dividendYield === "number"
                ? f.dividendYield
                : Number(f.dividendYield);
            const pct = Number.isFinite(raw)
              ? Math.floor(raw * 10000) / 100
              : undefined;
            return pct;
          })()
        : undefined;

      const summaryArr = [
        f?.sector ?? "",
        divYieldVal != null
          ? `배당 ${getNumberOrDash(divYieldVal, 2, "%")}`
          : "",
        f?.EPS != null ? `EPS ${getNumberOrDash(f.EPS)}` : "",
        f?.PBR != null ? `PBR ${getNumberOrDash(f.PBR)}` : "",
      ];
      const summary = summaryArr.filter(Boolean).join(" / ");

      return {
        ticker,
        name: f?.name ?? "-",
        price: closePrice != null ? closePrice.toFixed(2) : "-",
        marketCap: f?.marketCap ? Number(f.marketCap).toLocaleString() : "-",
        volume: f?.volume ? Number(f.volume).toLocaleString() : "-",
        PER: f?.PER != null ? getNumberOrDash(f.PER) : "-",
        EPS: f?.EPS != null ? getNumberOrDash(f.EPS) : "-",
        PBR: f?.PBR != null ? getNumberOrDash(f.PBR) : "-",
        dividendYield:
          divYieldVal != null ? getNumberOrDash(divYieldVal, 2, "%") : "-",
        summary,
        // Magic Formula Fields
        // magicRank: magic?.finalRank,
        // earningsYield: magic?.earningsYield,
        // returnOnCapital: magic?.returnOnCapital,
      };
    });
  }, [filteredTickers, dailyCloses, fundamentals]);

  // 검색(티커/회사명)
  const searchedData = useMemo(() => {
    if (!searchQuery) return allData;
    return allData.filter(
      (item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allData, searchQuery]);

  return (
    <div className="w-full">
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
      <FundamentalSettings
        enabledMetrics={enabledMetrics}
        onChange={setEnabledMetrics}
      />

      {/* 프리셋: 규칙 객체를 그대로 넘겨서 상태 교체(덮어쓰기) */}
      <PredefinedFilterTabs
        onApplyFilter={(preset) => {
          setFundamentalFilters({ ...preset }); // ← 덮어쓰기
          setShowCustomFilter(false); // 유명인 필터는 설정을 안 보고 싶어하므로 패널 닫기
        }}
      />

      {showCustomFilter && (
        <div className="mt-2 text-white">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-300">
              필터 조건을 선택하세요
            </span>
          </div>

          {/* 드롭다운: 규칙 객체를 주고받음 */}
          <FundamentalFilter
            filters={fundamentalFilters}
            onChange={(field, rule?: FilterRule) => {
              setFundamentalFilters((prev) => {
                const next = { ...prev };
                if (rule === undefined) delete next[field]; // ALL은 키 삭제
                else next[field] = rule;
                return next;
              });
            }}
          />
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowCustomFilter((prev) => !prev)}
          className="bg-[#444466] text-white text-sm px-3 py-1 rounded"
        >
          {showCustomFilter ? "필터링 닫기" : "커스텀 필터링"}
        </button>

        {showCustomFilter && (
          <button
            onClick={() => setFundamentalFilters(initialFilterState)}
            className="bg-gray-600 text-white text-sm px-3 py-1 rounded hover:bg-gray-500"
          >
            필터링 초기화
          </button>
        )}
      </div>

      <StockDataTable
        data={searchedData}
        enabledMetrics={enabledMetrics}
      />
    </div>
  );
};

export default StockTable;
