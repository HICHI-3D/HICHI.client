import Cube from '@assets/icon/cube.svg';
import Couch from '@assets/icon/couch.svg';
import Sparkle from '@assets/icon/sparkle.svg';

const Side = () => {
  const IconButton = [
    { id: 1, icon: Cube, label: '도면 그리기' },
    { id: 2, icon: Couch, label: '가구 리스트' },
    { id: 3, icon: Sparkle, label: 'AI 배치 추천' },
  ];
  return (
    <nav
      className={
        'w-fit h-full flex flex-col ds-right-12 justify-center gap-12 z-50'
      }
    >
      {IconButton.map((item) => (
        <div
          key={item.id}
          className={
            'px-8 py-6 flex flex-col items-center justify-center gap-4'
          }
        >
          <img src={item.icon} alt="실행취소" />
          <div className={'label-m text-gray-500)]'}>{item.label}</div>
        </div>
      ))}
    </nav>
  );
};
export default Side;
