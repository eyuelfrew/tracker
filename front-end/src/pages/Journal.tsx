import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJournal } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import { BookOpen, PenTool, Heart, Smile, Calendar, Plus, Trash2, AlertCircle, Check, X, Edit3 } from 'lucide-react'

interface JournalEntry {
    _id: string;
    title?: string;
    content: string;
    mood: string;
    tags?: string[];
    gratitude?: string[];
    goals?: string[];
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
}

const Journal = () => {
    const journalApi = useJournal();
    const { showSuccess, showError } = useToast();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditor, setShowEditor] = useState(false);

    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        mood: 'good',
        tags: [] as string[],
        gratitude: [] as string[],
        goals: [] as string[],
        isPrivate: true
    });
    const [tagInput, setTagInput] = useState('');
    const [gratitudeInput, setGratitudeInput] = useState('');
    const [goalsInput, setGoalsInput] = useState('');

    // Handle escape key for closing modals
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (editingEntry) setEditingEntry(null)
                if (showEditor) setShowEditor(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [editingEntry, showEditor])

    // Load entries and stats on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                // Load entries
                const entriesResponse: any = await journalApi.getEntries();
                setEntries(entriesResponse.entries || []);

                // Load stats
                try {
                    const statsResponse = await journalApi.getJournalStats();
                    setStats(statsResponse);
                } catch (err) {
                    console.log('Journal stats not available yet');
                }
            } catch (error: any) {
                console.error('Error loading journal data:', error);
                setError(error.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const addTag = () => {
        if (tagInput.trim() && !newEntry.tags.includes(tagInput.trim())) {
            setNewEntry({
                ...newEntry,
                tags: [...newEntry.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setNewEntry({
            ...newEntry,
            tags: newEntry.tags.filter((_, i) => i !== index)
        });
    };

    const addGratitude = () => {
        if (gratitudeInput.trim() && !newEntry.gratitude?.includes(gratitudeInput.trim())) {
            setNewEntry({
                ...newEntry,
                gratitude: [...(newEntry.gratitude || []), gratitudeInput.trim()]
            });
            setGratitudeInput('');
        }
    };

    const removeGratitude = (index: number) => {
        setNewEntry({
            ...newEntry,
            gratitude: newEntry.gratitude?.filter((_, i) => i !== index)
        });
    };

    const addGoal = () => {
        if (goalsInput.trim() && !newEntry.goals?.includes(goalsInput.trim())) {
            setNewEntry({
                ...newEntry,
                goals: [...(newEntry.goals || []), goalsInput.trim()]
            });
            setGoalsInput('');
        }
    };

    const removeGoal = (index: number) => {
        setNewEntry({
            ...newEntry,
            goals: newEntry.goals?.filter((_, i) => i !== index)
        });
    };

    const createEntry = async () => {
        if (!newEntry.content.trim()) {
            showError('Empty Entry', 'Please write something in your journal entry.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const entryData = {
                title: newEntry.title || `Entry for ${new Date().toLocaleDateString()}`,
                content: newEntry.content,
                mood: newEntry.mood,
                tags: newEntry.tags,
                gratitude: newEntry.gratitude,
                goals: newEntry.goals,
                isPrivate: newEntry.isPrivate
            };

            await journalApi.createEntry(entryData);

            // Reset form
            setNewEntry({
                title: '',
                content: '',
                mood: 'good',
                tags: [],
                gratitude: [],
                goals: [],
                isPrivate: true
            });
            setShowEditor(false);
            showSuccess('Entry Created!', 'Your journal entry has been saved successfully.');

            // Reload entries
            const entriesResponse: any = await journalApi.getEntries();
            setEntries(entriesResponse.entries || []);

            // Reload stats
            try {
                const statsResponse = await journalApi.getJournalStats();
                setStats(statsResponse);
            } catch (err) {
                console.log('Journal stats not available yet');
            }
        } catch (error: any) {
            console.error('Error creating journal entry:', error);
            showError('Save Failed', error.message || 'Failed to create journal entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        try {
            setLoading(true);
            await journalApi.deleteEntry(id);
            showSuccess('Entry Deleted', 'Your journal entry has been deleted successfully.');

            // Reload entries
            const entriesResponse: any = await journalApi.getEntries();
            setEntries(entriesResponse.entries || []);

            // Reload stats
            try {
                const statsResponse = await journalApi.getJournalStats();
                setStats(statsResponse);
            } catch (err) {
                console.log('Journal stats not available yet');
            }
        } catch (error: any) {
            console.error('Error deleting journal entry:', error);
            showError('Delete Failed', error.message || 'Failed to delete entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const moodColors: Record<string, string> = {
        amazing: 'text-purple-500',
        great: 'text-green-500',
        good: 'text-blue-500',
        okay: 'text-yellow-500',
        tired: 'text-gray-500',
        stressed: 'text-orange-500',
        sad: 'text-indigo-500',
        angry: 'text-red-500'
    };

    const moodIcons: Record<string, string> = {
        amazing: '🌟',
        great: '😊',
        good: '🙂',
        okay: '😐',
        tired: '😴',
        stressed: '😰',
        sad: '😔',
        angry: '😠'
    };

    const statsData = [
        {
            icon: BookOpen,
            label: 'Total Entries',
            value: stats?.totalEntries?.toString() || '0',
            change: `${stats?.entriesThisWeek || 0} this week`,
            color: 'text-blue-500'
        },
        {
            icon: Calendar,
            label: 'Writing Streak',
            value: `${stats?.currentStreak || 0} days`,
            change: 'Keep it up!',
            color: 'text-green-500'
        },
        {
            icon: Smile,
            label: 'Mood Trend',
            value: stats?.mostCommonMood || 'Good',
            change: 'Most common mood',
            color: moodColors[stats?.mostCommonMood] || 'text-blue-500'
        }
    ];

    if (loading && entries.length === 0) {
        return (
            <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your journal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
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

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stat.value}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
                            <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Journal Editor */}
                <div className="lg:col-span-1">
                    <div className="glass p-6 rounded-xl h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-900 dark:text-white">
                                <PenTool className="text-blue-500" size={20} />
                                <span>Write Entry</span>
                            </h2>
                        </div>

                        {!showEditor ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <PenTool size={32} className="text-blue-500" />
                                </div>
                                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Start Writing</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Capture your thoughts, feelings, and experiences
                                </p>
                                <button
                                    onClick={() => setShowEditor(true)}
                                    className="btn-primary inline-flex items-center space-x-2"
                                >
                                    <PenTool size={20} />
                                    <span>Write New Entry</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newEntry.title}
                                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                        placeholder="Today's reflection..."
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        How are you feeling?
                                    </label>
                                    <select
                                        value={newEntry.mood}
                                        onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                    >
                                        <option value="amazing">Amazing {moodIcons.amazing}</option>
                                        <option value="great">Great {moodIcons.great}</option>
                                        <option value="good">Good {moodIcons.good}</option>
                                        <option value="okay">Okay {moodIcons.okay}</option>
                                        <option value="tired">Tired {moodIcons.tired}</option>
                                        <option value="stressed">Stressed {moodIcons.stressed}</option>
                                        <option value="sad">Sad {moodIcons.sad}</option>
                                        <option value="angry">Angry {moodIcons.angry}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Content
                                    </label>
                                    <textarea
                                        value={newEntry.content}
                                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                                        placeholder="What's on your mind today? How did your day go? What are you grateful for?"
                                        className="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Tags
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            placeholder="Add a tag..."
                                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {newEntry.tags.map((tag, index) => (
                                            <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                                <span className="text-blue-800 dark:text-blue-200 text-sm">{tag}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(index)}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Gratitude
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={gratitudeInput}
                                            onChange={(e) => setGratitudeInput(e.target.value)}
                                            placeholder="What are you grateful for?"
                                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGratitude())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addGratitude}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {newEntry.gratitude?.map((gratitude, index) => (
                                            <div key={index} className="flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                                <span className="text-green-800 dark:text-green-200 text-sm">{gratitude}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeGratitude(index)}
                                                    className="ml-2 text-green-500 hover:text-green-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        Goals
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={goalsInput}
                                            onChange={(e) => setGoalsInput(e.target.value)}
                                            placeholder="What do you want to achieve?"
                                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addGoal}
                                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {newEntry.goals?.map((goal, index) => (
                                            <div key={index} className="flex items-center bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                                                <span className="text-purple-800 dark:text-purple-200 text-sm">{goal}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeGoal(index)}
                                                    className="ml-2 text-purple-500 hover:text-purple-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <button
                                        onClick={() => {
                                            setShowEditor(false);
                                            setNewEntry({
                                                title: '',
                                                content: '',
                                                mood: 'good',
                                                tags: [],
                                                gratitude: [],
                                                goals: [],
                                                isPrivate: true
                                            });
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createEntry}
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Entry'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Journal Entries List */}
                <div className="lg:col-span-2">
                    <div className="glass p-6 rounded-xl h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-900 dark:text-white">
                                <BookOpen className="text-blue-500" size={20} />
                                <span>Your Entries</span>
                            </h2>
                        </div>

                        {entries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <BookOpen size={40} className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">No entries yet</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Start your journaling journey by writing your first entry
                                </p>
                                <button
                                    onClick={() => setShowEditor(true)}
                                    className="btn-primary inline-flex items-center space-x-2"
                                >
                                    <PenTool size={20} />
                                    <span>Write Your First Entry</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {entries.map((entry) => (
                                    <motion.div
                                        key={entry._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {entry.title && (
                                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                                        {entry.title}
                                                    </h3>
                                                )}
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                                    {entry.content.length > 150
                                                        ? `${entry.content.substring(0, 150)}...`
                                                        : entry.content
                                                    }

                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">

                                                <button
                                                    onClick={() => setEditingEntry(entry)}
                                                    className="text-gray-400 hover:text-green-500 transition-colors"
                                                    title="Edit entry"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteEntry(entry._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete entry"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className={`flex items-center ${moodColors[entry.mood] || 'text-gray-500'}`}>
                                                {moodIcons[entry.mood] || '📝'} {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {entry.tags && entry.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {entry.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>



    {/* Edit Entry Modal */ }
    <AnimatePresence>
        {editingEntry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Entry</h2>
                            <button
                                onClick={() => setEditingEntry(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={editingEntry.title || ''}
                                    onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Entry title..."
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    value={editingEntry.content}
                                    onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                                    rows={12}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                    placeholder="Write your thoughts..."
                                />
                            </div>

                            {/* Mood */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mood
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(moodIcons).map(([mood, icon]) => (
                                        <button
                                            key={mood}
                                            type="button"
                                            onClick={() => setEditingEntry({ ...editingEntry, mood })}
                                            className={`px-3 py-2 rounded-lg border-2 transition-all ${editingEntry.mood === mood
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                        >
                                            <span className="mr-1">{icon}</span>
                                            <span className="text-sm capitalize">{mood}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingEntry(null)}
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await journalApi.updateEntry(editingEntry._id, {
                                                title: editingEntry.title,
                                                content: editingEntry.content,
                                                mood: editingEntry.mood,
                                                tags: editingEntry.tags,
                                                gratitude: editingEntry.gratitude,
                                                goals: editingEntry.goals,
                                                isPrivate: editingEntry.isPrivate
                                            })

                                            // Reload entries
                                            const entriesResponse: any = await journalApi.getEntries()
                                            setEntries(entriesResponse.entries || [])

                                            setEditingEntry(null)
                                            showSuccess('Entry Updated!', 'Your journal entry has been updated successfully.')
                                        } catch (error: any) {
                                            showError('Update Failed', error.message || 'Failed to update entry.')
                                        }
                                    }}
                                    disabled={!editingEntry.content.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Update Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
    </div >
)
}

export default Journal