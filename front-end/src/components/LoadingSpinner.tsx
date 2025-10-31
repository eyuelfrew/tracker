import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center">
                <motion.div
                    className="relative mb-6"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={32} className="text-white" />
                    </div>
                    <motion.div
                        className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-xl mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Grow-Up</h2>
                    <p className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                        Loading your growth journey...
                    </p>
                </motion.div>

                <motion.div
                    className="mt-8 flex justify-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default LoadingSpinner