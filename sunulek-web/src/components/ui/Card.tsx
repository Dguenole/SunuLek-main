import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ 
  className, 
  hoverable = false, 
  padding = 'md',
  children,
  ...props 
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  }

  return (
    <motion.div
      whileHover={hoverable ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' } : undefined}
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100',
        'transition-all duration-300',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
