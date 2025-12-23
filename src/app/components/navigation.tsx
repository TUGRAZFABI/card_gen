'use client'

import { useState } from 'react'
import { Menu, X, Github, User } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              MyApp
            </Link>
          </div>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="../features" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Generate unique
            </Link>
            <Link 
              href="/features/packCard" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Get Card
            </Link>
            
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Search Card
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Inventory
            </Link>
          </div>

          {/* Right side buttons - GitHub, Login, Register */}
          <div className="flex items-center space-x-4">
            {/* GitHub Link */}
            <a
              href="https://github.com/TUGRAZFABI/card_gen"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5 mr-1" />
              <span className="text-sm">GitHub</span>
            </a>

            {/* Login Button */}
            <Link 
              href="/login" 
              className="hidden sm:inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors px-3 py-1"
            >
              <User className="w-4 h-4 mr-1" />
              <span>Login</span>
            </Link>

            {/* Register Button */}
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/features" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Generate unique
            </Link>
            <Link 
              href="/docs" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Get card
            </Link>
            <Link 
              href="/pricing" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              search card
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Inventory
            </Link>
            
            {/* Mobile GitHub link */}
            <a
              href="https://github.com/TUGRAZFABI/card_gen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Github className="w-5 h-5 mr-2" />
              <span>GitHub</span>
            </a>

            {/* Mobile login button */}
            <Link 
              href="/login" 
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}