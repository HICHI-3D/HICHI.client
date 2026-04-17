import Header from '@components/header.tsx';
import Side from '@components/side.tsx';

const AppShell = () => {
  return (
    <div className="flex w-full h-full">
      {/* 사이드바: 전체 높이 */}
      <Side />

      {/* 오른쪽: 헤더 + 콘텐츠 */}
      <div className="col flex-1 min-w-0">
        <Header />
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 bg-gray-100" />
      </div>
    </div>
  );
};

export default AppShell;
