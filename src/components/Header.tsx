import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../hooks/useCart'

const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { user, isAdmin, signOut, adminLogout } = useAuth()
  const { cartItemsCount } = useCart()
  const navigate = useNavigate()

  const categories = [
    { name: 'ALL PRODUCTS', path: '/products' },
    { name: 'BEDS', path: '/beds' },
    { name: 'STATIONERY', path: '/stationery' },
    { name: 'BOOKS', path: '/books' },
    { name: 'BATHWARE', path: '/bathware' },
    { name: 'DORM', path: '/dorm' }
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowUserDropdown(false)
      }
      if (!target.closest('.menu-container')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      if (isAdmin) {
        adminLogout()
      } else {
        await signOut()
      }
      setShowUserDropdown(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleAdminPortal = () => {
    if (isAdmin) {
      navigate('/admin-dashboard')
    }
    setShowUserDropdown(false)
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const closeMenu = () => {
    setShowMenu(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            DAYKART
          </Link>

          {/* Menu Button */}
          <div className="menu-container relative">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
              <span>MENU</span>
            </button>

            {/* Category Menu Dropdown */}
            {showMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm tracking-wide transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard?tab=cart" className="relative text-gray-700 hover:text-gray-900 transition-colors">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {user || isAdmin ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">{isAdmin ? 'Admin' : user?.email?.split('@')[0]}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{isAdmin ? 'Administrator' : user?.email?.split('@')[0]}</div>
                      <div className="text-sm text-gray-500">{isAdmin ? 'admin@daykart.com' : user?.email}</div>
                      {isAdmin && (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mt-1">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <button
                        onClick={handleAdminPortal}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    
                    {!isAdmin && (
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header