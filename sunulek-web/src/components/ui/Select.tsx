import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl',
              'text-gray-900 appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'hover:border-gray-300',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-gray-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
