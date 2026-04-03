import Logo from '@assets/logo.svg';
import Back from '@assets/icon/arrow-back.svg';
import Undo from '@assets/icon/arrow-undo.svg';
import Save from '@assets/icon/save.svg';
import Enter from '@assets/icon/enter.svg';

const Header = () => {
  return (
    <div className="w-screen h-fit flex items-center bg-gray-200 ds-under-12 relative z-10">
      <div className={'w-fit px-8 '}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={'w-full h-fit p-spacing-12 flex justify-between'}>
        <div className={'w-fit h-fit flex gap-8'}>
          <div
            className={
              'px-8 py-6 flex flex-col items-center justify-center gap-4)]'
            }
          >
            <img src={Back} alt="실행취소" />
            <div className={'label-m text-gray-500'}>실행취소</div>
          </div>
          <div
            className={
              'px-8 py-6 flex flex-col items-center justify-center gap-4'
            }
          >
            <img src={Undo} alt="되돌리기" />
            <div className={'label-m text-gray-500'}>되돌리기</div>
          </div>
        </div>
        <div className={'w-fit h-fit flex gap-8'}>
          <div
            className={
              'px-12 py-spacing-6 bg-functional-indigo rounded-8 flex flex-col items-center justify-center gap-4'
            }
          >
            <img src={Save} alt="저장" />
            <div className={'label-m text-gray-200)]'}>저장</div>
          </div>
          <div
            className={
              'px-8 py-6 flex flex-col items-center justify-center gap-4'
            }
          >
            <img src={Enter} alt="나가기" />
            <div className={'label-m text-gray-800'}>나가기</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
