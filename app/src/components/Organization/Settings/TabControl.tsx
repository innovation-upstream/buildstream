import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export enum Tab {
  INFORMATION,
  TREASURY,
  ADMINISTRATORS,
  TASK_MANAGER_API
}

export const TabMap: Record<Tab, string> = {
  [Tab.INFORMATION]: 'information',
  [Tab.TREASURY]: 'treasury',
  [Tab.ADMINISTRATORS]: 'administrators',
  [Tab.TASK_MANAGER_API]: 'task_manager_api'
}

interface ITabControlProps {
  active?: Tab
  onChange?: (val: Tab) => void
  tabs: Record<Tab, ReactNode>
}

const TabControl = ({
  active = Tab.INFORMATION,
  tabs,
  onChange
}: ITabControlProps) => {
  const { t } = useTranslation('organization')
  const [activeTab, setActiveTab] = useState(active)

  const handleChange = (tab: Tab) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  useEffect(() => setActiveTab?.(active), [active])

  return (
    <>
      <div className='flex justify-between whitespace-nowrap overflow-x-auto scrollbar-hide'>
        {Object.entries(TabMap).map(([k, v]) => (
          <span key={v} className='relative'>
            <input
              id={`settings-tab-${v}`}
              type='radio'
              value={k}
              className='hidden peer'
              onChange={() => handleChange(Number(k))}
              checked={activeTab === Number(k)}
            />
            <label
              htmlFor={`settings-tab-${v}`}
              className='text-xl cursor-pointer w-full text-center px-3 py-2 text-[#B1B3B9] peer-checked:font-bold peer-checked:text-[#17191A] peer-checked:font-semibold'
            >
              {t(v)}
            </label>
            <div className='mt-2 w-full bottom-0 divider border-transparent peer-checked:border-blue-500' />
          </span>
        ))}
      </div>
      <div className='divider -mt-0.5' />
      <div className='mt-5'>{tabs[activeTab]}</div>
    </>
  )
}

export default TabControl
