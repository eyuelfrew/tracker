import { motion } from 'framer-motion'
import { DollarSign, Plus, TrendingUp, TrendingDown, PieChart } from 'lucide-react'

const Finance = () => {
    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3 text-gray-900 dark:text-white">
                    <DollarSign className="text-blue-500" />
                    <span>Finance</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Take control of your financial future
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="text-green-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Income</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$4,250</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <TrendingDown className="text-red-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Expenses</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$3,100</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <DollarSign className="text-blue-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Savings</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$1,150</p>
                    <p className="text-sm text-green-500">+27% vs last month</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <PieChart className="text-purple-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Budget Left</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$850</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">27% remaining</p>
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
                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <DollarSign size={40} className="text-green-500" />
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Smart Finance Tracking Coming Soon!
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        Track income and expenses, visualize spending patterns,
                        set savings goals, create budgets, and achieve financial freedom
                        with intelligent insights and recommendations.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <TrendingUp size={16} className="text-green-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">Income and expense tracking</span>
                        </div>

                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                <PieChart size={16} className="text-purple-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">Visual spending analytics</span>
                        </div>

                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                <DollarSign size={16} className="text-blue-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">Savings goals and budgets</span>
                        </div>
                    </div>

                    <button className="btn-primary inline-flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Finance