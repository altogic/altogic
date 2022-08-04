import React, { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import { profileTabs, profileTabList } from '@/constants/constant'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ProfileTabs = () => {
  const router = useRouter()
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  function handleChange(index) {
    setSelectedTabIndex(index)
    router.push(profileTabs[index].href)
  }
  useEffect(() => {
    if (router.query.tab) {
      setSelectedTabIndex(
        profileTabs.map((tab) => tab.name.toLowerCase()).indexOf(router.query.tab),
      )
    }
  }, [router.query.tab])
  return (
    <Tab.Group onChange={(index) => handleChange(index)} selectedIndex={selectedTabIndex}>
      <Tab.List className='flex items-center overflow-auto'>
        {profileTabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              classNames(
                'group inline-flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium leading-5 text-slate-700 border-b-2 border-gray-200 whitespace-nowrap',
                'focus:outline-none',
                selected
                  ? 'text-indigo-700 border-indigo-700'
                  : 'text-slate-400 hover:text-indigo-700 hover:border-indigo-700',
              )
            }
          >
            <tab.icon className='mr-2 h-5 w-5' />
            <span>{tab.name}</span>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className='mt-8'>
        {profileTabList.map((tab) => (
          <Tab.Panel key={tab.name}>
            <tab.component type={tab.propValue}></tab.component>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default ProfileTabs
