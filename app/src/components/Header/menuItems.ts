interface IProps {
  label: string
  url: string
}

type menuTypes = 'default' | 'task' | 'organization'

export const defaultMenu: IProps[] = [
  {
    label: 'support',
    url: '/support'
  }
]

export const menuItems: Record<menuTypes, IProps[]> = {
  default: defaultMenu,
  task: [
    {
      label: 'find_tasks',
      url: '/task'
    },
    {
      label: 'my_work',
      url: '/account'
    },
    ...defaultMenu
  ],
  organization: [
    {
      label: 'find_tasks',
      url: '/task'
    },
    {
      label: 'my_work',
      url: '/account'
    },
    ...defaultMenu
  ]
}

export const activeMenuItems = (path = '/'): IProps[] => {
  if (path.includes('organization')) {
    return menuItems.organization
  }
  if (path.includes('task') || path.includes('account')) {
    return menuItems.task
  }
  return menuItems.default
}
