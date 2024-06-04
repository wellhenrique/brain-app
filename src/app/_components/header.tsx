import { ThemeToggle } from '@/components/ui/theme-toggle'

import { BrainIcon } from 'lucide-react'
import { HeaderActions } from './header-actions'

export function Header() {
  return (
    <div className="dark:bg-slate-900 py-4 border-b border-gray-200 dark:border-slate-900 bg-white">
      <div className="container mx-auto flex  justify-between items-center">
        <div className="flex items-center gap-4">
          <BrainIcon className="text-primary" />
          <span className="text-2xl font-bold text-primary">BigBrain</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <HeaderActions />
        </div>
      </div>
    </div>
  )
}
