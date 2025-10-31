import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, BookOpen, DollarSign, TrendingUp, Sparkles, Zap } from 'lucide-react'

const Landing = () => {
    const features = [
        {
            icon: Target,
            title: 'Smart Habits',
            description: 'Build lasting habits with intelligent tracking and personalized insights'
        },
        {
            icon: BookOpen,
            title: 'Mindful Journal',
            description: 'Reflect, grow, and track your emotional journey with guided prompts'
        },
        {
            icon: DollarSign,
            title: 'Money Mastery',
            description: 'Take control of your finances with smart budgeting and goal tracking'
        },
        {
            icon: TrendingUp,
            title: 'Growth Analytics',
            description: 'Visualize your progress and celebrate every milestone achieved'
        }
    ]

    const motivationalQuotes = [
        "Every expert was once a beginner",
        "Progress, not perfection",
        "Small steps, big changes",
        "Your future self will thank you"
    ]

    const currentQuote = motivationalQuotes[Math.floor(Date.now() / 5000) % motivationalQuotes.length]

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
            {/* Navigation */}
            <nav className="relative z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-2"
                    >
                        <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">Grow-Up</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            to="/auth"
                            className="px-6 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative px-6 py-20">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />

                    {/* Floating particles */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                            }}
                            animate={{
                                y: [null, -50, null],
                                opacity: [0, 0.6, 0],
                            }}
                            transition={{
                                duration: Math.random() * 4 + 3,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    {/* Main Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
                        >
                            <Zap size={16} />
                            <span>Transform Your Life, One Day at a Time</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            Welcome to{' '}
                            <span className="text-blue-600 dark:text-blue-400">
                                Grow-Up
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
                            Your personal growth companion that helps you build better habits,
                            track progress, and achieve your goals with style.
                        </p>

                        <motion.p
                            key={currentQuote}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg text-blue-600 dark:text-blue-400 italic font-medium"
                        >
                            "{currentQuote}"
                        </motion.p>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-16"
                    >
                        <Link
                            to="/auth"
                            className="inline-flex items-center space-x-3 px-8 py-4 btn-primary text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span>Start Your Journey</span>
                            <ArrowRight size={20} />
                        </Link>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Free to start • No credit card required
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index + 0.6 }}
                                className="glass p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Landing