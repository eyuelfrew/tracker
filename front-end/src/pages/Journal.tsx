import { motion } from 'framer-motion'
import { BookOpen, PenTool, Heart, Smile, Calendar } from 'lucide-react'

const Journal = () => {
    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3 text-gray-900 dark:text-white">
                    <BookOpen className="text-blue-500" />
                    <span>Journal</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Reflect, grow, and track your emotional journey
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <BookOpen className="text-blue-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Total Entries</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">127</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+5 this week</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="text-green-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Writing Streak</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">12 days</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Keep it up!</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <Smile className="text-yellow-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mood Trend</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">📈 Good</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Improving</p>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 rounded-xl text-center"
            >
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={40} className="text-blue-500" />
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Personal Journal Coming Soon!
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        Write daily reflections, track your mood, practice gratitude,
                        and document your personal growth journey with guided prompts
                        and emotional insights.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <PenTool size={16} className="text-purple-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">Rich text editor with prompts</span>
                        </div>

                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                                <Smile size={16} className="text-yellow-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">Mood tracking and analytics</span>
                        </div>

                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <Heart size={16} className="text-red-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">Gratitude practice integration</span>
                        </div>
                    </div>

                    <button className="btn-primary inline-flex items-center space-x-2">
                        <PenTool size={20} />
                        <span>Write Your First Entry</span>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Journal