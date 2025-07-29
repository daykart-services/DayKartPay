import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" replace />
  }

  if (!requireAdmin && !user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute