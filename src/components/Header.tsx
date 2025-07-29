import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { user, isAdmin, signOut, adminLogout } = useAuth()
  const navigate = useNavigate()

  const categories = [
    { name: 'ALL PRODUCTS', path: '/products' },
    { name: 'BEDS', path: '/beds' },
    { name: 'STATIONERY', path: '/stationery' },
    { name: 'BOOKS', path: '/books' },
    { name: 'BATHWARE', path: '/bathware' },
    { name: 'DORM', path: '/dorm' }
  ]

  const handleLogout = async () => {
    if (isAdmin) {
      adminLogout()
    } else {
      await signOut()
    }
    setShowUserDropdown(false)
    navigate('/')
  }

  const handleAdminPortal = () => {
    if (isAdmin) {
      navigate('/admin-dashboard')
    }
    setShowUserDropdown(false)
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            DAYKART
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            MENU
          </button>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-gray-700 hover:text-gray-900">
              <ShoppingCart size={24} />
            </Link>

            {user || isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">{isAdmin ? 'admin' : user?.email?.split('@')[0]}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{isAdmin ? 'admin' : user?.email?.split('@')[0]}</div>
                      <div className="text-sm text-gray-500">{isAdmin ? 'admin@daykart.com' : user?.email}</div>
                      {isAdmin && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <button
                        onClick={handleAdminPortal}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Admin Portal
                      </button>
                    )}
                    
                    {!isAdmin && (
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Category Menu */}
        {showMenu && (
          <div className="border-t border-gray-200 py-4">
            <nav className="flex justify-center space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  onClick={() => setShowMenu(false)}
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm tracking-wide"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header