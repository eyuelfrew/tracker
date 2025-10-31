import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Target,
    BookOpen,
    DollarSign,
    Settings,
    LogOut,
    User,
    Moon,
    Sun,
    Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
    const { state, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/habits', icon: Target, label: 'Habits' },
        { path: '/journal', icon: BookOpen, label: 'Journal' },
        { path: '/finance', icon: DollarSign, label: 'Finance' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ]

    return (
        <motion.nav
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 h-full w-64 glass border-r border-gray-200 dark:border-gray-700 z-50"
        >
            <div className="p-6">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Grow-Up
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Personal Growth Hub</p>
                </motion.div>

                {/* User Profile */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-4 glass-light rounded-xl"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                                {state.user?.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Welcome back! 👋
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Items */}
                <div className="space-y-2 mb-8">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * (index + 2) }}
                        >
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border ${isActive
                                        ? 'text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400'
                                        : 'text-gray-600 dark:text-gray-300 border-transparent hover:border-blue-500 dark:hover:border-blue-400'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        onClick={toggleTheme}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 border border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 border border-transparent hover:border-red-500 dark:hover:border-red-500 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar