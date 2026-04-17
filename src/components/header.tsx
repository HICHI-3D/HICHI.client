import Back from '@assets/icon/arrow-back.svg';
import Undo from '@assets/icon/arrow-undo.svg';
import Save from '@assets/icon/save.svg';
import Enter from '@assets/icon/enter.svg';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-gray-200 ds-under-12 px-12 py-12 shrink-0 w-full">
      {/* 실행취소 / 되돌리기 */}
      <div className="flex items-center gap-8">
        <button className="col flex-center gap-4 px-8 py-6 rounded-8 hover:bg-gray-300 transition-colors">
          <img src={Back} alt="실행취소" className="size-28" />
          <span className="label-m text-gray-500">실행취소</span>
        </button>
        <button className="col flex-center gap-4 px-8 py-6 rounded-8 hover:bg-gray-300 transition-colors">
          <img src={Undo} alt="되돌리기" className="size-28" />
          <span className="label-m text-gray-500">되돌리기</span>
        </button>
      </div>

      {/* 프로필 카드 / 저장 / 나가기 */}
      <div className="flex items-center gap-8">
        {/* 유저 프로필 카드 */}
        <div className="flex items-center gap-12 px-16 py-12 bg-gray-100 rounded-8 ds-all-12 w-[183px]">
          <div className="size-28 rounded-max bg-functional-indigo shrink-0" />
          <div className="col flex-1 min-w-0">
            <span className="label-m text-gray-800 truncate">s0meri</span>
            <span className="label-s text-gray-600 truncate">저장 이력 없음</span>
          </div>
          <div className="w-px self-stretch bg-gray-400 shrink-0" />
          <div className="size-28 shrink-0 flex-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button className="col flex-center gap-4 px-12 py-6 bg-functional-indigo rounded-8 hover:bg-functional-indigo-60 transition-colors">
          <img src={Save} alt="저장" className="size-28" />
          <span className="label-m text-gray-200">저장</span>
        </button>

        {/* 나가기 버튼 */}
        <button className="col flex-center gap-4 px-8 py-6 rounded-8 hover:bg-gray-300 transition-colors w-[60px]">
          <img src={Enter} alt="나가기" className="size-28" />
          <span className="label-m text-gray-800">나가기</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
