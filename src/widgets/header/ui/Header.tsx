import { Icon, type IconName } from '@shared/ui';

type NavItem = {
  id: number;
  icon: IconName;
  text: string;
};

const Header = () => {
  const UndoRedoList: NavItem[] = [
    { id: 0, icon: 'arrow-back', text: '실행취소' },
    { id: 1, icon: 'arrow-undo', text: '되돌리기' },
  ];
  return (
    <header
      className="
      flex w-full shrink-0 items-center justify-between bg-gray-200 p-12
      ds-under-12
    "
    >
      {/* 실행취소 / 되돌리기 */}
      <div className="flex items-center gap-8">
        {UndoRedoList.map((item) => (
          <button
            key={item.id}
            className="
              col flex-center gap-4 rounded-8 px-8 py-6 transition-colors
              hover:bg-gray-300
            "
          >
            <Icon name={item.icon} alt={item.text} className="size-28" />
            <span className="label-m text-gray-500">{item.text}</span>
          </button>
        ))}
      </div>

      {/* 프로필 카드 / 저장 / 나가기 */}
      <div className="flex items-center gap-8">
        {/* 유저 프로필 카드 */}
        <div
          className="
          flex w-[183px] items-center gap-12 rounded-8 bg-gray-100 px-16 py-12
          ds-all-12
        "
        >
          <div className="size-28 shrink-0 rounded-max bg-functional-indigo" />
          <div className="min-w-0 col flex-1">
            <span className="truncate label-m text-gray-800">s0meri</span>
            <span className="truncate label-s text-gray-600">
              저장 이력 없음
            </span>
          </div>
          <div className="w-px shrink-0 self-stretch bg-gray-400" />
          <div className="flex-center size-28 shrink-0 text-gray-500">
            <Icon name="setting" alt="설정" className="size-28" />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          className="
          col flex-center gap-4 rounded-8 bg-functional-indigo px-12 py-6
          transition-colors
          hover:bg-functional-indigo-60
        "
        >
          <Icon name="save" alt="저장" className="size-28" />
          <span className="label-m text-gray-200">저장</span>
        </button>

        {/* 나가기 버튼 */}
        <button
          className="
          col flex-center w-[60px] gap-4 rounded-8 px-8 py-6 transition-colors
          hover:bg-gray-300
        "
        >
          <Icon name="enter" alt="나가기" className="size-28" />
          <span className="label-m text-gray-800">나가기</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
