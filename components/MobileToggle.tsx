import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/NavigationSidebar";
import ServerSidebar from "./server/ServerSidebar";

const MobileToggle = ({ serverId }: {serverId: string}) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu />
				</Button>
      </SheetTrigger>
      <SheetContent className="p-0 gap-0 flex" side="left">
        <div className="w-[65px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
		</Sheet>
	);
};

export default MobileToggle;
