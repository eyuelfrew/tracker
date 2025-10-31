import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Settings = () => {
    const { state } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [profileData, setProfileData] = useState({
        firstName: state.user?.profile?.firstName || '',
        lastName: state.user?.profile?.lastName || ''
    })

    const [notifications, setNotifications] = useState({
        habitReminders: true,
        journalPrompts: false,
        weeklyReports: true,
        achievements: true
    })

    const handleProfileSave = () => {
        // Here you would typically save to backend
        console.log('Saving profile:', profileData)
        // Show success message
    }

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3 text-gray-900 dark:text-white">
                    <SettingsIcon className="text-blue-500" />
                    <span>Settings</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Customize your Grow-Up experience
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-xl"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <User className="text-blue-500" size={20} />
                        <span>Profile</span>
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                value={state.user?.username || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Username cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={state.user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                    placeholder="First name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus-ring text-gray-900 dark:text-white"
                                    placeholder="Last name"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleProfileSave}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <Save size={16} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </motion.div>

                {/* Appearance Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-xl"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Palette className="text-blue-500" size={20} />
                        <span>Appearance</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Choose between light and dark mode
                                </p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                            <div className="flex space-x-2">
                                <div className="w-8 h-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded"></div>
                                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-xl"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Bell className="text-blue-500" size={20} />
                        <span>Notifications</span>
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {key === 'habitReminders' && 'Get reminded about your daily habits'}
                                        {key === 'journalPrompts' && 'Daily reflection reminders'}
                                        {key === 'weeklyReports' && 'Weekly progress summaries'}
                                        {key === 'achievements' && 'Celebrate your milestones'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleNotification(key as keyof typeof notifications)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-xl"
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Shield className="text-blue-500" size={20} />
                        <span>Security</span>
                    </h2>
                    <div className="space-y-4">
                        <button className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                            Change Password
                        </button>

                        <button className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                            Delete Account
                        </button>

                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Note:</strong> Account deletion is permanent and cannot be undone.
                                All your data will be permanently removed.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Settings