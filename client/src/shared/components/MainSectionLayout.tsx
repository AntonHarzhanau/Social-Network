
interface MainSectionLayoutProps {
pageContent: React.ReactNode;
asideContent: React.ReactNode;
}

const MainSectionLayout = ({ pageContent, asideContent }: MainSectionLayoutProps) => {
  return (
   <div className="flex gap-2">
      <div className="flex flex-col flex-5 ">
        {pageContent}
      </div>
      <aside className="flex-3 h-fit sticky top-14 p-2">
        {asideContent}
      </aside>
    </div>
  )
}

export default MainSectionLayout
