import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
    id: string
    username: string
    email: string
    profile: {
        firstName?: string
        lastName?: string
        avatar?: string
        theme: 'dark' | 'light'
    }
}

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
}

type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_USER'; payload: User }

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,
    isAuthenticated: false
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false
            }
        case 'LOGOUT':
            localStorage.removeItem('token')
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            }
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}

const AuthContext = createContext<{
    state: AuthState
    login: (email: string, password: string) => Promise<void>
    register: (userData: any) => Promise<void>
    logout: () => void
    updateUser: (userData: User) => void
} | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    const API_URL = 'http://localhost:5000/api'

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (response.ok) {
                        const data = await response.json()
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: { user: data.user, token }
                        })
                    } else {
                        dispatch({ type: 'LOGOUT' })
                    }
                } catch (error) {
                    console.error('Auth check failed:', error)
                    dispatch({ type: 'LOGOUT' })
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }

        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: data.user, token: data.token }
                })
            } else {
                throw new Error(data.message || 'Login failed')
            }
        } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false })
            throw error
        }
    }

    const register = async (userData: any) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const data = await response.json()

            if (response.ok) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: data.user, token: data.token }
                })
            } else {
                throw new Error(data.message || 'Registration failed')
            }
        } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false })
            throw error
        }
    }

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
    }

    const updateUser = (userData: User) => {
        dispatch({ type: 'UPDATE_USER', payload: userData })
    }

    return (
        <AuthContext.Provider value={{
            state,
            login,
            register,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}