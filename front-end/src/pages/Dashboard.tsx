import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useHabits, useJournal, useFinance } from '../hooks/useApi'
import { Target, BookOpen, DollarSign, TrendingUp, Calendar, Flame, Plus, Check, AlertCircle } from 'lucide-react'

const Dashboard = () => {
    const { state } = useAuth()
    const habitsApi = useHabits()
    const journalApi = useJournal()
    const financeApi = useFinance()

    const [habits, setHabits] = useState<any[]>([])
    const [habitStats, setHabitStats] = useState<any>(null)
    const [journalStats, setJournalStats] = useState<any>(null)
    const [financeStats, setFinanceStats] = useState<any>(null)
    const [journalEntry, setJournalEntry] = useState('')
    const [newHabit, setNewHabit] = useState('')
    const [showAddHabit, setShowAddHabit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                // Load habits and stats
                const habitsData = await habitsApi.getHabits()
                const habitStatsData = await habitsApi.getHabitStats()

                setHabits(habitsData || [])
                setHabitStats(habitStatsData)

                // Load journal stats
                try {
                    const journalStatsData = await journalApi.getJournalStats()
                    setJournalStats(journalStatsData)
                } catch (err) {
                    console.log('Journal stats not available yet')
                }

                // Load finance stats
                try {
                    const financeStatsData = await financeApi.getFinanceStats()
                    setFinanceStats(financeStatsData)
                } catch (err) {
                    console.log('Finance stats not available yet')
                }

            } catch (error: any) {
                console.error('Error loading dashboard data:', error)
                setError(error.message || 'Failed to load data')
            } finally {
                setLoading(false)
            }
        }

        if (state.isAuthenticated) {
            loadData()
        }
    }, [state.isAuthenticated])

    const toggleHabit = async (habitId: string) => {
        try {
            const habit = habits.find(h => h._id === habitId)
            if (!habit) return

            // Check if already completed today
            const today = new Date().toISOString().split('T')[0]
            const completedToday = habit.completedDates?.some((entry: any) =>
                new Date(entry.date).toISOString().split('T')[0] === today
            )

            if (completedToday) {
                await habitsApi.uncompleteHabit(habitId)
            } else {
                await habitsApi.completeHabit(habitId)
            }

            // Refresh habits data
            const updatedHabits = await habitsApi.getHabits()
            setHabits(updatedHabits || [])

            // Refresh stats
            const updatedStats = await habitsApi.getHabitStats()
            setHabitStats(updatedStats)
        } catch (error: any) {
            console.error('Error toggling habit:', error)
            setError(error.message || 'Failed to update habit')
        }
    }

    const addHabit = async () => {
        if (!newHabit.trim()) return

        try {
            await habitsApi.createHabit({
                title: newHabit,
                category: 'other',
                frequency: 'daily'
            })

            // Refresh habits data
            const updatedHabits = await habitsApi.getHabits()
            setHabits(updatedHabits || [])

            // Refresh stats
            const updatedStats = await habitsApi.getHabitStats()
            setHabitStats(updatedStats)

            setNewHabit('')
            setShowAddHabit(false)
        } catch (error: any) {
            console.error('Error adding habit:', error)
            setError(error.message || 'Failed to add habit')
        }
    }

    const saveJournalEntry = async () => {
        if (!journalEntry.trim()) return

        try {
            await journalApi.createEntry({
                content: journalEntry,
                mood: 'good', // Default mood
                title: `Entry for ${new Date().toLocaleDateString()}`
            })

            setJournalEntry('')

            // Refresh journal stats
            const updatedStats = await journalApi.getJournalStats()
            setJournalStats(updatedStats)
        } catch (error: any) {
            console.error('Error saving journal entry:', error)
            setError(error.message || 'Failed to save journal entry')
        }
    }

    const isHabitCompletedToday = (habit: any) => {
        const today = new Date().toISOString().split('T')[0]
        return habit.completedDates?.some((entry: any) =>
            new Date(entry.date).toISOString().split('T')[0] === today
        )
    }

    const stats = [
        {
            icon: Target,
            label: 'Active Habits',
            value: habitStats?.activeHabits?.toString() || '0',
            change: `${habitStats?.completedToday || 0} completed today`,
            color: 'text-green-500'
        },
        {
            icon: Flame,
            label: 'Best Streak',
            value: `${habitStats?.longestStreak || 0} days`,
            change: 'Keep it up!',
            color: 'text-orange-500'
        },
        {
            icon: BookOpen,
            label: 'Journal Entries',
            value: journalStats?.totalEntries?.toString() || '0',
            change: `${journalStats?.entriesThisWeek || 0} this week`,
            color: 'text-blue-500'
        },
        {
            icon: DollarSign,
            label: 'Net Savings',
            value: financeStats ? `$${financeStats.netSavings?.toFixed(0) || '0'}` : '$0',
            change: financeStats ? `${financeStats.savingsRate || 0}% savings rate` : 'No data yet',
            color: 'text-emerald-500'
        }
    ]

    const motivationalQuotes = [
        "The only impossible journey is the one you never begin.",
        "Your limitation—it's only your imagination.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones."
    ]

    const currentQuote = motivationalQuotes[Math.floor(Date.now() / (1000 * 60 * 60)) % motivationalQuotes.length]

    if (loading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                    Welcome back, {state.user?.profile?.firstName || state.user?.username}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Ready to continue your growth journey?
                </p>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2"
                >
                    <AlertCircle size={20} className="text-red-500" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                    <button
                        onClick={() => setError('')}
                        className="ml-auto text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                </motion.div>
            )}

            {/* Motivational Quote */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 p-6 glass rounded-xl text-center"
            >
                <motion.p
                    key={currentQuote}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl italic text-gray-700 dark:text-gray-300 mb-2"
                >
                    "{currentQuote}"
                </motion.p>
                <div className="w-16 h-1 bg-gradient-accent rounded-full mx-auto" />
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
                        <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
                {/* Today's Habits */}
                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-900 dark:text-white">
                            <Target className="text-blue-500" size={20} />
                            <span>Today's Habits</span>
                        </h2>
                        <button
                            onClick={() => setShowAddHabit(!showAddHabit)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {showAddHabit && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newHabit}
                                    onChange={(e) => setNewHabit(e.target.value)}
                                    placeholder="Enter new habit..."
                                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus-ring text-gray-900 dark:text-white"
                                    onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                                />
                                <button
                                    onClick={addHabit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-3">
                        {habits.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Target size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No habits yet. Add your first habit to get started!</p>
                            </div>
                        ) : (
                            habits.map((habit, index) => (
                                <motion.div
                                    key={habit._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => toggleHabit(habit._id)}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isHabitCompletedToday(habit)
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                                                }`}
                                        >
                                            {isHabitCompletedToday(habit) && <Check size={14} />}
                                        </button>
                                        <span className={`text-gray-700 dark:text-gray-300 ${isHabitCompletedToday(habit) ? 'line-through opacity-60' : ''
                                            }`}>
                                            {habit.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-orange-500 flex items-center space-x-1">
                                            <Flame size={12} />
                                            <span>{habit.currentStreak}</span>
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Journal */}
                <div className="glass p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <BookOpen className="text-blue-500" size={20} />
                        <span>Quick Journal</span>
                    </h2>
                    <div className="space-y-4">
                        <textarea
                            value={journalEntry}
                            onChange={(e) => setJournalEntry(e.target.value)}
                            placeholder="How are you feeling today? What are you grateful for?"
                            className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        />
                        <button
                            onClick={saveJournalEntry}
                            disabled={!journalEntry.trim()}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Entry
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Progress Chart Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass p-6 rounded-xl"
            >
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                    <TrendingUp className="text-blue-500" size={20} />
                    <span>Your Progress</span>
                </h2>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Progress charts coming soon!</p>
                        <p className="text-sm">Track your habits and see your growth over time</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Dashboard