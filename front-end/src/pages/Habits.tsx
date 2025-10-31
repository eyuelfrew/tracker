import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Target,
    Plus,
    Flame,
    Calendar,
    TrendingUp,
    Edit3,
    Trash2,
    Check,
    X,
    Filter,
    Search,
    MoreVertical,
    Award,
    Clock
} from 'lucide-react'
import { useHabits } from '../hooks/useApi'

interface Habit {
    _id: string
    title: string
    description?: string
    category: string
    icon: string
    color: string
    frequency: string
    targetValue: number
    unit: string
    isActive: boolean
    currentStreak: number
    longestStreak: number
    completedDates: Array<{
        date: string
        value: number
    }>
    createdAt: string
}

const Habits = () => {
    const habitsApi = useHabits()

    const [habits, setHabits] = useState<Habit[]>([])
    const [habitStats, setHabitStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

    const [newHabit, setNewHabit] = useState({
        title: '',
        description: '',
        category: 'other',
        icon: '🎯',
        color: '#3B82F6',
        frequency: 'daily',
        targetValue: 1,
        unit: 'times'
    })

    const categories = [
        { value: 'all', label: 'All Categories', color: '#6B7280' },
        { value: 'health', label: 'Health', color: '#10B981' },
        { value: 'productivity', label: 'Productivity', color: '#3B82F6' },
        { value: 'mindfulness', label: 'Mindfulness', color: '#8B5CF6' },
        { value: 'fitness', label: 'Fitness', color: '#F59E0B' },
        { value: 'learning', label: 'Learning', color: '#EF4444' },
        { value: 'discipline', label: 'Discipline', color: '#6366F1' },
        { value: 'other', label: 'Other', color: '#6B7280' }
    ]

    const habitIcons = ['🎯', '💪', '📚', '🧘', '🏃', '�', '🎨', '🌱', '⚡', '🔥', '🌟', '🚀']

    // Load data
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')

            const [habitsData, statsData] = await Promise.all([
                habitsApi.getHabits(),
                habitsApi.getHabitStats()
            ])

            setHabits(habitsData || [])
            setHabitStats(statsData)
        } catch (error: any) {
            console.error('Error loading habits:', error)
            setError(error.message || 'Failed to load habits')
        } finally {
            setLoading(false)
        }
    }

    const isHabitCompletedToday = (habit: Habit) => {
        const today = new Date().toISOString().split('T')[0]
        return habit.completedDates?.some(entry =>
            new Date(entry.date).toISOString().split('T')[0] === today
        )
    }

    const toggleHabit = async (habitId: string) => {
        try {
            const habit = habits.find(h => h._id === habitId)
            if (!habit) return

            if (isHabitCompletedToday(habit)) {
                await habitsApi.uncompleteHabit(habitId)
            } else {
                await habitsApi.completeHabit(habitId)
            }

            await loadData() // Refresh data
        } catch (error: any) {
            console.error('Error toggling habit:', error)
            setError(error.message || 'Failed to update habit')
        }
    }

    const createHabit = async () => {
        try {
            if (!newHabit.title.trim()) return

            await habitsApi.createHabit(newHabit)
            await loadData()

            setNewHabit({
                title: '',
                description: '',
                category: 'other',
                icon: '🎯',
                color: '#3B82F6',
                frequency: 'daily',
                targetValue: 1,
                unit: 'times'
            })
            setShowAddModal(false)
        } catch (error: any) {
            console.error('Error creating habit:', error)
            setError(error.message || 'Failed to create habit')
        }
    }

    const updateHabit = async () => {
        try {
            if (!editingHabit || !editingHabit.title.trim()) return

            await habitsApi.updateHabit(editingHabit._id, {
                title: editingHabit.title,
                description: editingHabit.description,
                category: editingHabit.category,
                icon: editingHabit.icon,
                color: editingHabit.color,
                frequency: editingHabit.frequency,
                targetValue: editingHabit.targetValue,
                unit: editingHabit.unit
            })

            await loadData()
            setEditingHabit(null)
        } catch (error: any) {
            console.error('Error updating habit:', error)
            setError(error.message || 'Failed to update habit')
        }
    }

    const deleteHabit = async (habitId: string) => {
        try {
            await habitsApi.deleteHabit(habitId)
            await loadData()
            setShowDeleteModal(null)
        } catch (error: any) {
            console.error('Error deleting habit:', error)
            setError(error.message || 'Failed to delete habit')
        }
    }

    const filteredHabits = habits.filter(habit => {
        const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || habit.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const getCompletionRate = (habit: Habit) => {
        const last30Days = new Date()
        last30Days.setDate(last30Days.getDate() - 30)

        const completionsLast30Days = habit.completedDates?.filter(entry =>
            new Date(entry.date) >= last30Days
        ).length || 0

        return Math.round((completionsLast30Days / 30) * 100)
    }

    if (loading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your habits...</p>
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3 text-gray-900 dark:text-white">
                            <Target className="text-blue-500" />
                            <span>Habits</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Build powerful habits that transform your life
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add Habit</span>
                    </button>
                </div>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between"
                >
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">×</button>
                </motion.div>
            )}

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <Target className="text-blue-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Total Habits</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{habitStats?.totalHabits || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{habitStats?.activeHabits || 0} active</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <Check className="text-green-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Completed Today</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{habitStats?.completedToday || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {habitStats?.totalHabits > 0 ? Math.round((habitStats?.completedToday || 0) / habitStats.totalHabits * 100) : 0}% completion rate
                    </p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <Flame className="text-orange-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Best Streak</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{habitStats?.longestStreak || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">days</p>
                </div>

                <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="text-purple-500" size={24} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Average Streak</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{habitStats?.averageStreak || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">days</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search habits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white appearance-none cursor-pointer"
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </motion.div>

            {/* Habits Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredHabits.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12"
                        >
                            <Target size={64} className="mx-auto mb-4 text-gray-400 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {searchTerm || filterCategory !== 'all' ? 'No habits found' : 'No habits yet'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchTerm || filterCategory !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Create your first habit to start building better routines'
                                }
                            </p>
                            {!searchTerm && filterCategory === 'all' && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="btn-primary inline-flex items-center space-x-2"
                                >
                                    <Plus size={20} />
                                    <span>Add Your First Habit</span>
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        filteredHabits.map((habit, index) => (
                            <motion.div
                                key={habit._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: 0.1 * index }}
                                className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Habit Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: habit.color + '20' }}
                                        >
                                            {habit.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{habit.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                {habit.category} • {habit.frequency}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingHabit(habit)}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(habit._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                {habit.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {habit.description}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1 text-orange-500">
                                            <Flame size={16} />
                                            <span className="text-sm font-medium">{habit.currentStreak}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-purple-500">
                                            <Award size={16} />
                                            <span className="text-sm font-medium">{habit.longestStreak}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-blue-500">
                                            <TrendingUp size={16} />
                                            <span className="text-sm font-medium">{getCompletionRate(habit)}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Complete Button */}
                                <button
                                    onClick={() => toggleHabit(habit._id)}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${isHabitCompletedToday(habit)
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {isHabitCompletedToday(habit) ? (
                                        <>
                                            <Check size={20} />
                                            <span>Completed Today!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={20} />
                                            <span>Mark Complete</span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Add/Edit Habit Modal */}
            <AnimatePresence>
                {(showAddModal || editingHabit) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => {
                            setShowAddModal(false)
                            setEditingHabit(null)
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Habit Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingHabit ? editingHabit.title : newHabit.title}
                                        onChange={(e) => {
                                            if (editingHabit) {
                                                setEditingHabit({ ...editingHabit, title: e.target.value })
                                            } else {
                                                setNewHabit({ ...newHabit, title: e.target.value })
                                            }
                                        }}
                                        placeholder="e.g., Morning meditation"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={editingHabit ? editingHabit.description : newHabit.description}
                                        onChange={(e) => {
                                            if (editingHabit) {
                                                setEditingHabit({ ...editingHabit, description: e.target.value })
                                            } else {
                                                setNewHabit({ ...newHabit, description: e.target.value })
                                            }
                                        }}
                                        placeholder="Brief description of your habit..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Category
                                        </label>
                                        <select
                                            value={editingHabit ? editingHabit.category : newHabit.category}
                                            onChange={(e) => {
                                                if (editingHabit) {
                                                    setEditingHabit({ ...editingHabit, category: e.target.value })
                                                } else {
                                                    setNewHabit({ ...newHabit, category: e.target.value })
                                                }
                                            }}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                        >
                                            {categories.slice(1).map(category => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                            Frequency
                                        </label>
                                        <select
                                            value={editingHabit ? editingHabit.frequency : newHabit.frequency}
                                            onChange={(e) => {
                                                if (editingHabit) {
                                                    setEditingHabit({ ...editingHabit, frequency: e.target.value })
                                                } else {
                                                    setNewHabit({ ...newHabit, frequency: e.target.value })
                                                }
                                            }}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Icon
                                    </label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {habitIcons.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => {
                                                    if (editingHabit) {
                                                        setEditingHabit({ ...editingHabit, icon })
                                                    } else {
                                                        setNewHabit({ ...newHabit, icon })
                                                    }
                                                }}
                                                className={`p-3 text-2xl rounded-lg border-2 transition-colors ${(editingHabit ? editingHabit.icon : newHabit.icon) === icon
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false)
                                            setEditingHabit(null)
                                        }}
                                        className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingHabit ? updateHabit : createHabit}
                                        disabled={!(editingHabit ? editingHabit.title.trim() : newHabit.title.trim())}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editingHabit ? 'Update Habit' : 'Create Habit'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowDeleteModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass p-6 rounded-xl w-full max-w-sm"
                        >
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Delete Habit
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete this habit? This action cannot be undone and all progress will be lost.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(null)}
                                    className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteHabit(showDeleteModal)}
                                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Habits