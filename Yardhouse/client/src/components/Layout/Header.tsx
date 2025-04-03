/**
 * @fileoverview Header component for the Yard Renovator application
 */

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

/**
 * Navigation items
 */
const navigation = [
  { name: 'Home', href: '/', public: true },
  { name: 'Pricing', href: '/pricing', public: true },
  { name: 'Dashboard', href: '/dashboard', public: false },
  { name: 'New Renovation', href: '/renovate', public: false },
  { name: 'My Renovations', href: '/my-renovations', public: false },
];

/**
 * Header component with navigation and user menu
 * @returns {JSX.Element} Header component
 */
const Header: React.FC = () => {
  const { state, login, logout } = useAuth();
  const { isAuthenticated, user, loading } = state;

  return (
    <Disclosure as="nav" className="bg-white shadow-md border-b border-secondary-100">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="flex items-center">
                    {/* Logo */}
                    <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2L4,6v12l8,4l8-4V6L12,2z M12,4.28l6,3v3.35l-6,3l-6-3V7.28L12,4.28z M12,19.72l-6-3v-3.35l6,3l6-3v3.35 L12,19.72z"/>
                    </svg>
                    <span className="ml-2 text-xl font-bold text-secondary-800">Yard Renovator</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Desktop navigation */}
                  {navigation.map((item) => {
                    if (item.public || isAuthenticated) {
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-secondary-700 hover:text-secondary-900 hover:border-primary-300 transition"
                        >
                          {item.name}
                        </Link>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* User menu (desktop) */}
                {loading ? (
                  <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse"></div>
                ) : isAuthenticated && user ? (
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.picture}
                          alt={user.name}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="px-4 py-2 border-b border-secondary-100">
                          <p className="text-sm font-medium text-secondary-800">{user.name}</p>
                          <p className="text-sm text-secondary-500 truncate">{user.email}</p>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs font-medium text-primary-700">Credits: {user.creditBalance}</span>
                            <Link to="/pricing" className="ml-2 text-xs text-primary-600 hover:text-primary-800">
                              Buy more
                            </Link>
                          </div>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-secondary-50' : ''
                              } block px-4 py-2 text-sm text-secondary-700`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? 'bg-secondary-50' : ''
                              } block w-full text-left px-4 py-2 text-sm text-secondary-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    onClick={login}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Sign in
                  </button>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                if (item.public || isAuthenticated) {
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-secondary-600 hover:bg-secondary-50 hover:border-primary-300 hover:text-secondary-800"
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                }
                return null;
              })}
            </div>
            {isAuthenticated && user ? (
              <div className="pt-4 pb-3 border-t border-secondary-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.picture}
                      alt={user.name}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-secondary-800">{user.name}</div>
                    <div className="text-sm font-medium text-secondary-500">{user.email}</div>
                    <div className="text-xs font-medium text-primary-700 mt-1">
                      Credits: {user.creditBalance} 
                      <Link to="/pricing" className="ml-2 text-primary-600 hover:text-primary-800">
                        Buy more
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50"
                  >
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-secondary-200">
                <div className="px-4">
                  <button
                    onClick={login}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header; 