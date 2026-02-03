import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastInput {
  message: string
  type?: Toast['type']
}

interface ToastState {
  toasts: Toast[]
  addToast: (input: ToastInput | string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (input) => {
    const id = Date.now().toString()
    const message = typeof input === 'string' ? input : input.message
    const type = typeof input === 'string' ? 'info' : (input.type || 'info')
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 4000)
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
