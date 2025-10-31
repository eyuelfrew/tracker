import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { state } = useAuth()

    if (state.isLoading) {
        return <LoadingSpinner />
    }

    if (!state.isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute