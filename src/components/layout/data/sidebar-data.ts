import {
  LayoutDashboard,
  Monitor,
  Bell,
  Palette,
  UserCog,
  FileText,
  Bot,
  Sparkles,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Demo User',
    email: 'user@invoiceai.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Invoice AI',
      logo: Sparkles,
      plan: 'Professional',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Invoice Analysis',
          url: '/invoices',
          icon: FileText,
        },
        {
          title: 'AI Chat',
          url: '/chat',
          icon: Bot,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Account',
          url: '/settings',
          icon: UserCog,
        },
        {
          title: 'Appearance',
          url: '/settings/appearance',
          icon: Palette,
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
          icon: Bell,
        },
        {
          title: 'Display',
          url: '/settings/display',
          icon: Monitor,
        },
      ],
    },
  ],
}
