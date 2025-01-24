import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Database, Link, Plus, SettingsIcon, SquareStackIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'



type Props = {}

const TabList = (props: Props) => {

  const router = useRouter()
  const handle = () => {
    router.push('/agency/image')
  }

  return (
    <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <Plus />
      </TabsTrigger>

      <TabsTrigger
        value="Layers"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Database />
      </TabsTrigger>

      <button onClick={handle} className='p-2 m-2 rounded-md'>
        <span className='text-white'>
          ✨
        </span>
      </button>

    </TabsList>
  )
}

export default TabList
