import Logo from '@assets/logo.svg';
import Back from '@assets/icon/arrow-back.svg';
import Undo from '@assets/icon/arrow-undo.svg';
import Save from '@assets/icon/save.svg';
import Enter from '@assets/icon/enter.svg';

const Header = () => {
  return (
    <div className="w-screen h-fit fixed flex items-center bg-[var(--gray-200)] dropshadow-under-12">
      <div className={'w-fit px-[var(--spacing-8)] '}>
        <img src={Logo} alt="logo" />
      </div>
      <div
        className={'w-full h-fit p-[var(--spacing-12)] flex justify-between'}
      >
        <div className={'w-fit h-fit flex gap-[var(--spacing-8)]'}>
          <div
            className={
              'px-[var(--spacing-8)] py-[var(--spacing-6)] flex flex-col items-center justify-center gap-[var(--spacing-4)]'
            }
          >
            <img src={Back} alt="실행취소" />
            <div className={'lable-m text-[var(--gray-500)]'}>실행취소</div>
          </div>
          <div
            className={
              'px-[var(--spacing-8)] py-[var(--spacing-6)] flex flex-col items-center justify-center gap-[var(--spacing-4)]'
            }
          >
            <img src={Undo} alt="되돌리기" />
            <div className={'lable-m text-[var(--gray-500)]'}>되돌리기</div>
          </div>
        </div>
        <div className={'w-fit h-fit flex gap-[var(--spacing-8)]'}>
          <div
            className={
              'px-[var(--spacing-12)] py-[var(--spacing-6)] bg-[var(--functional-indigo)] rounded-[var(--radius-8)] flex flex-col items-center justify-center gap-[var(--spacing-4)]'
            }
          >
            <img src={Save} alt="저장" />
            <div className={'lable-m text-[var(--gray-200)]'}>저장</div>
          </div>
          <div
            className={
              'px-[var(--spacing-8)] py-[var(--spacing-6)] flex flex-col items-center justify-center gap-[var(--spacing-4)]'
            }
          >
            <img src={Enter} alt="나가기" />
            <div className={'lable-m text-[var(--gray-800)]'}>나가기</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
