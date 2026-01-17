export const Footer = () => {
    return (
      <footer className="w-full py-8 mt-auto border-t border-[#2E2E3E] bg-[#1b1b2f]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            
            {/* Bottom Ad Section */}
            <div className="w-full md:w-[728px] h-[90px] bg-[#232336] rounded-lg border border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 text-sm gap-1 mb-8">
                <span className="font-semibold">ADVERTISEMENT</span>
                <span className="text-xs">배너 광고 (728x90)</span>
            </div>

            <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">
                    © {new Date().getFullYear()} Stock Info. All rights reserved.
                </p>
                <div className="flex justify-center gap-6 text-xs text-gray-400">
                    <span className="cursor-pointer hover:text-white transition-colors">이용약관</span>
                    <span className="cursor-pointer hover:text-white transition-colors">개인정보처리방침</span>
                    <span className="cursor-pointer hover:text-white transition-colors">문의하기</span>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                    본 사이트에서 제공하는 정보는 투자 참고용이며, 이를 근거로 한 투자 결과에 대해 책임지지 않습니다.
                </p>
            </div>
        </div>
      </footer>
    );
  };
  