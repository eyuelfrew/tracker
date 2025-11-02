import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
    headers?: Record<string, string>
}

interface ApiResponse<T> {
    data: T | null
    error: string | null
    loading: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useApi = <T = any>() => {
    const { state } = useAuth()
    const [response, setResponse] = useState<ApiResponse<T>>({
        data: null,
        error: null,
        loading: false
    })

    const request = useCallback(async (endpoint: string, options: ApiOptions = {}) => {
        setResponse(prev => ({ ...prev, loading: true, error: null }))

        try {
            const { method = 'GET', body, headers = {} } = options

            const config: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            }

            // Add auth token if available
            if (state.token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${state.token}`
                }
            }

            // Add body for non-GET requests
            if (body && method !== 'GET') {
                config.body = JSON.stringify(body)
            }

            const res = await fetch(`${API_URL}${endpoint}`, config)
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong')
            }

            setResponse({ data, error: null, loading: false })
            return data
        } catch (error: any) {
            const errorMessage = error.message || 'Network error'
            setResponse({ data: null, error: errorMessage, loading: false })
            throw error
        }
    }, [state.token])

    return { ...response, request }
}

// Specific hooks for different resources
export const useHabits = () => {
    const api = useApi()

    const getHabits = useCallback(() => api.request('/habits'), [api])
    const createHabit = useCallback((habit: any) => api.request('/habits', { method: 'POST', body: habit }), [api])
    const updateHabit = useCallback((id: string, habit: any) => api.request(`/habits/${id}`, { method: 'PUT', body: habit }), [api])
    const deleteHabit = useCallback((id: string) => api.request(`/habits/${id}`, { method: 'DELETE' }), [api])
    const completeHabit = useCallback((id: string, value?: number) => api.request(`/habits/${id}/complete`, { method: 'POST', body: { value } }), [api])
    const uncompleteHabit = useCallback((id: string) => api.request(`/habits/${id}/complete`, { method: 'DELETE' }), [api])
    const getHabitStats = useCallback(() => api.request('/habits/stats'), [api])

    return {
        ...api,
        getHabits,
        createHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        uncompleteHabit,
        getHabitStats
    }
}

export const useJournal = () => {
    const api = useApi()

    const getEntries = useCallback((page = 1, limit = 10) => api.request(`/journal?page=${page}&limit=${limit}`), [api])
    const getEntry = useCallback((id: string) => api.request(`/journal/${id}`), [api])
    const createEntry = useCallback((entry: any) => api.request('/journal', { method: 'POST', body: entry }), [api])
    const updateEntry = useCallback((id: string, entry: any) => api.request(`/journal/${id}`, { method: 'PUT', body: entry }), [api])
    const deleteEntry = useCallback((id: string) => api.request(`/journal/${id}`, { method: 'DELETE' }), [api])
    const getJournalStats = useCallback(() => api.request('/journal/stats'), [api])

    return {
        ...api,
        getEntries,
        getEntry,
        createEntry,
        updateEntry,
        deleteEntry,
        getJournalStats
    }
}

export const useFinance = () => {
    const api = useApi()

    const getRecords = useCallback((filters: any = {}) => {
        const params = new URLSearchParams(filters).toString()
        return api.request(`/finance?${params}`)
    }, [api])

    const getRecord = useCallback((id: string) => api.request(`/finance/${id}`), [api])
    const createRecord = useCallback((record: any) => api.request('/finance', { method: 'POST', body: record }), [api])
    const updateRecord = useCallback((id: string, record: any) => api.request(`/finance/${id}`, { method: 'PUT', body: record }), [api])
    const deleteRecord = useCallback((id: string) => api.request(`/finance/${id}`, { method: 'DELETE' }), [api])
    const getFinanceStats = useCallback((period = 'month') => api.request(`/finance/stats?period=${period}`), [api])
    const getCategories = useCallback((period = 'month') => api.request(`/finance/categories?period=${period}`), [api])

    return {
        ...api,
        getRecords,
        getRecord,
        createRecord,
        updateRecord,
        deleteRecord,
        getFinanceStats,
        getCategories
    }
}