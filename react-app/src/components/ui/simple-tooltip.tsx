import React, { useState, useRef } from "react";

interface Props {
  content: string | React.ReactNode;
  children: React.ReactNode;
}

export function SimpleTooltip({ content, children }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // 툴팁을 버튼의 바로 아래쪽 중앙에 위치시킵니다.
      setPosition({
        top: rect.bottom + 10, // 10px 여백 (아래로)
        left: rect.left + rect.width / 2,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {children}
      {isVisible && (
        <div
          className="fixed z-50 px-3 py-2 text-xs text-white bg-slate-900 rounded shadow-lg pointer-events-none transform -translate-x-1/2 max-w-xs transition-opacity duration-200 whitespace-pre-line"
          style={{ top: position.top, left: position.left }}
        >
          {content}
          {/* 화살표 (툴팁 박스 위쪽에 위치하여 위를 가리킴) */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
        </div>
      )}
    </div>
  );
}
