import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import {NavigationAction} from './NavigationAction';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { currentProfile } from '@/lib/current-profile';
import NavigationItem from './NavigationItem';
import { ModeToggle } from '../ThemeToggle';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })
  
  return (
    <div className='flex space-y-4 flex-col  h-full bg-[#E3E5E8] dark:bg-[#1E1F22] items-center text-primary w-full py-3'>
      <NavigationAction />
      <Separator className="h-[2px] w-10 rounded-md mx-auto bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className='flex-1 w-full'>
        {servers.map((server) => (
          <div key={server.id} className='mb-4'><NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} /></div>
        ))}
      </ScrollArea>
      <div className='mb-3 space-y-4 flex items-center flex-col mt-auto'>
        <ModeToggle />
        <UserButton afterSignOutUrl='/' appearance={{
          elements: {
          avatarBox: ""
        }}}  />
      </div>
    </div>
  )
}

export default NavigationSidebar
