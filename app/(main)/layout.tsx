import NavigationSidebar from "@/components/navigation/NavigationSidebar";
 
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
		<div className="h-full">
      <div className="hidden md:flex flex-col h-full w-[72px] fixed inset-y-0 z-30">
        <NavigationSidebar/>
      </div>
			<main className="md:pl-[72px] h-full">{children}</main>
		</div>
	);
};

export default MainLayout;
