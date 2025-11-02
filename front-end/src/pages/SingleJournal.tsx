import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useJournal } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';
import { BookOpen, ArrowLeft, Edit3, Trash2, Calendar, Heart, Target, Save, X, Check } from 'lucide-react';

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

const SingleJournal = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const journalApi = useJournal();
    const { showSuccess, showError } = useToast();
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedEntry, setEditedEntry] = useState<JournalEntry | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [gratitudeInput, setGratitudeInput] = useState('');
    const [goalsInput, setGoalsInput] = useState('');

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                setLoading(true);
                setError('');
                
                if (id) {
                    const data = await journalApi.getEntry(id);
                    setEntry(data);
                    setEditedEntry({ ...data });
                }
            } catch (error: any) {
                console.error('Error fetching journal entry:', error);
                setError(error.message || 'Failed to load journal entry');
                showError('Error', error.message || 'Failed to load journal entry');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEntry();
        }
    }, [id, journalApi, showError]);

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (entry) {
            setEditedEntry({ ...entry });
        }
    };

    const handleSaveEdit = async () => {
        if (!editedEntry || !id) return;

        try {
            setLoading(true);
            
            await journalApi.updateEntry(id, {
                title: editedEntry.title,
                content: editedEntry.content,
                mood: editedEntry.mood,
                tags: editedEntry.tags,
                gratitude: editedEntry.gratitude,
                goals: editedEntry.goals,
                isPrivate: editedEntry.isPrivate
            });

            showSuccess('Entry Updated!', 'Your journal entry has been updated successfully.');
            
            // Update local state
            setEntry({ ...editedEntry });
            
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating journal entry:', error);
            showError('Update Failed', error.message || 'Failed to update entry');
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && editedEntry && !editedEntry.tags?.includes(tagInput.trim())) {
            setEditedEntry({
                ...editedEntry,
                tags: [...(editedEntry.tags || []), tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        if (editedEntry) {
            setEditedEntry({
                ...editedEntry,
                tags: editedEntry.tags?.filter((_, i) => i !== index) || []
            });
        }
    };

    const addGratitude = () => {
        if (gratitudeInput.trim() && editedEntry && !editedEntry.gratitude?.includes(gratitudeInput.trim())) {
            setEditedEntry({
                ...editedEntry,
                gratitude: [...(editedEntry.gratitude || []), gratitudeInput.trim()]
            });
            setGratitudeInput('');
        }
    };

    const removeGratitude = (index: number) => {
        if (editedEntry) {
            setEditedEntry({
                ...editedEntry,
                gratitude: editedEntry.gratitude?.filter((_, i) => i !== index) || []
            });
        }
    };

    const addGoal = () => {
        if (goalsInput.trim() && editedEntry && !editedEntry.goals?.includes(goalsInput.trim())) {
            setEditedEntry({
                ...editedEntry,
                goals: [...(editedEntry.goals || []), goalsInput.trim()]
            });
            setGoalsInput('');
        }
    };

    const removeGoal = (index: number) => {
        if (editedEntry) {
            setEditedEntry({
                ...editedEntry,
                goals: editedEntry.goals?.filter((_, i) => i !== index) || []
            });
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        
        if (!window.confirm('Are you sure you want to delete this journal entry?')) {
            return;
        }

        try {
            setLoading(true);
            
            await journalApi.deleteEntry(id);
            showSuccess('Entry Deleted', 'Your journal entry has been deleted successfully.');
            
            navigate('/journal'); // Redirect back to journal list
        } catch (error: any) {
            console.error('Error deleting journal entry:', error);
            showError('Delete Failed', error.message || 'Failed to delete entry');
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

    if (loading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading journal entry...</p>
                </div>
            </div>
        );
    }

    if (error || !entry) {
        return (
            <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Entry Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || 'The journal entry you are looking for does not exist or has been deleted.'}
                    </p>
                    <button
                        onClick={() => navigate('/journal')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Journal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/journal')}
                            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Journal</span>
                        </button>
                        {!isEditing ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleStartEdit}
                                    className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Edit3 size={16} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <X size={16} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    <span>Save</span>
                                </button>
                            </div>
                        )}
                    </div>
                    {!isEditing ? (
                        <>
                            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                                {entry.title || `Entry from ${new Date(entry.createdAt).toLocaleDateString()}`}
                            </h1>
                            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                                <span className={`flex items-center ${moodColors[entry.mood] || 'text-gray-500'}`}>
                                    {moodIcons[entry.mood] || '📝'} {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                                </span>
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-1" />
                                    <span>{new Date(entry.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={editedEntry?.title || ''}
                                onChange={(e) => setEditedEntry(prev => prev ? {...prev, title: e.target.value} : null)}
                                className="w-full text-4xl font-bold mb-2 bg-transparent text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="Entry title..."
                            />
                            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-4">
                                <select
                                    value={editedEntry?.mood || 'good'}
                                    onChange={(e) => setEditedEntry(prev => prev ? {...prev, mood: e.target.value} : null)}
                                    className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-1" />
                                    <span>{new Date(entry?.createdAt || '').toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-xl mb-8"
                >
                    {!isEditing ? (
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                {entry.content}
                            </p>
                        </div>
                    ) : (
                        <textarea
                            value={editedEntry?.content || ''}
                            onChange={(e) => setEditedEntry(prev => prev ? {...prev, content: e.target.value} : null)}
                            className="w-full h-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        />
                    )}
                </motion.div>

                {/* Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                        <span className="mr-2">#</span> Tags
                    </h3>
                    {!isEditing ? (
                        entry?.tags && entry.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {entry.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">No tags added</p>
                        )
                    ) : (
                        <div>
                            <div className="flex space-x-2 mb-2">
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
                            <div className="flex flex-wrap gap-2 mt-2">
                                {editedEntry?.tags?.map((tag, index) => (
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
                    )}
                </motion.div>

                {/* Gratitude */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                        <Heart className="mr-2 text-red-500" size={20} /> Gratitude
                    </h3>
                    {!isEditing ? (
                        entry?.gratitude && entry.gratitude.length > 0 ? (
                            <div className="space-y-2">
                                {entry.gratitude.map((gratitude, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-start p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
                                    >
                                        <Check className="flex-shrink-0 mt-0.5 mr-3 text-green-500" size={20} />
                                        <p className="text-gray-700 dark:text-gray-300">{gratitude}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">No gratitude items added</p>
                        )
                    ) : (
                        <div>
                            <div className="flex space-x-2 mb-2">
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
                            <div className="space-y-2 mt-2">
                                {editedEntry?.gratitude?.map((gratitude, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-start p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
                                    >
                                        <span className="flex-shrink-0 mt-0.5 mr-3 text-green-500" size={20}>✓</span>
                                        <p className="text-gray-700 dark:text-gray-300 flex-1">{gratitude}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeGratitude(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Goals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                        <Target className="mr-2 text-purple-500" size={20} /> Goals
                    </h3>
                    {!isEditing ? (
                        entry?.goals && entry.goals.length > 0 ? (
                            <div className="space-y-2">
                                {entry.goals.map((goal, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-start p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800"
                                    >
                                        <Check className="flex-shrink-0 mt-0.5 mr-3 text-purple-500" size={20} />
                                        <p className="text-gray-700 dark:text-gray-300">{goal}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">No goals added</p>
                        )
                    ) : (
                        <div>
                            <div className="flex space-x-2 mb-2">
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
                            <div className="space-y-2 mt-2">
                                {editedEntry?.goals?.map((goal, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-start p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800"
                                    >
                                        <span className="flex-shrink-0 mt-0.5 mr-3 text-purple-500" size={20}>✓</span>
                                        <p className="text-gray-700 dark:text-gray-300 flex-1">{goal}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeGoal(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SingleJournal;