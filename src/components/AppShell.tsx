import Header from '@components/header.tsx';
import Side from '@components/side.tsx';

const AppShell = () => {
  return (
    <div className={'w-full h-full flex flex-col'}>
      <Header />
      <div className={'w-fit h-full flex relative z-20'}>
        <Side />
      </div>
    </div>
  );
};
export default AppShell;
