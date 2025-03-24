import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "./language-switcher";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isMobile?: boolean;
  onClick?: () => void;
}

function NavLink({ href, children, isMobile = false, onClick }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <a
        className={`
          transition-colors px-3 py-2 rounded-md
          ${isMobile ? "block w-full text-left mb-2" : ""}
          ${isActive 
            ? "text-primary" 
            : "text-gray-600 hover:text-gray-900"}
        `}
        onClick={onClick}
      >
        {children}
      </a>
    </Link>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary font-bold text-xl flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2 h-6 w-6"
                >
                  <path d="M17 3L21 7L17 11"></path>
                  <path d="M21 7H3"></path>
                  <path d="M7 13L3 17L7 21"></path>
                  <path d="M3 17H21"></path>
                </svg>
                <span>{t('appName')}</span>
              </a>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-8 text-sm font-medium">
              <NavLink href="/">{t('header.dashboard')}</NavLink>
              <NavLink href="/alerts">{t('header.alerts')}</NavLink>
              <NavLink href="/history">{t('header.history')}</NavLink>
              <NavLink href="/about">{t('header.about')}</NavLink>
            </nav>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu" className="ml-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-b border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3">
              <NavLink href="/" isMobile onClick={closeMenu}>{t('header.dashboard')}</NavLink>
              <NavLink href="/alerts" isMobile onClick={closeMenu}>{t('header.alerts')}</NavLink>
              <NavLink href="/history" isMobile onClick={closeMenu}>{t('header.history')}</NavLink>
              <NavLink href="/about" isMobile onClick={closeMenu}>{t('header.about')}</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
