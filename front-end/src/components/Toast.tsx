import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export interface ToastProps {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
    id,
    type,
    title,
    message,
    duration = 4000,
    onClose
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id)
        }, duration)

        return () => clearTimeout(timer)
    }, [id, duration, onClose])

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    }

    const colors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    }

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
    }

    const Icon = icons[type]

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`p-4 rounded-lg border shadow-lg max-w-sm w-full backdrop-blur-sm ${colors[type]}`}
        >
            <div className="flex items-start space-x-3">
                <Icon size={20} className={`mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{title}</p>
                    {message && (
                        <p className="text-sm opacity-90 mt-1">{message}</p>
                    )}
                </div>
                <button
                    onClick={() => onClose(id)}
                    className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    )
}

export default Toast