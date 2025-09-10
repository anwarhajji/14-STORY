// FIX: Implemented the Header component, which was previously a placeholder.
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_TITLE } from '../constants';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { t, direction } = useLocalization();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const translations = {
    home: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' },
    educators: { fr: 'Éducateurs', en: 'Educators', ar: 'المعلمون' },
  };

  // Do not render header on certain pages like onboarding
  if (location.pathname === '/onboarding') {
    return null;
  }

  return (
    <header className="navbar bg-base-100 shadow-md" dir={direction}>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/home">{t(translations.home)}</Link></li>
            <li><Link to="/educators">{t(translations.educators)}</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">{APP_TITLE}</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/home">{t(translations.home)}</Link></li>
          <li><Link to="/educators">{t(translations.educators)}</Link></li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <LanguageSelector />
        <label className="swap swap-rotate">
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
          <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29l.71-.71a1,1,0,0,0-1.41-1.41l-.71.71A1,1,0,0,0,5.64,7.05ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM20,12a1,1,0,0,0-1-1H18a1,1,0,0,0,0,2h1A1,1,0,0,0,20,12ZM17,5.64a1,1,0,0,0-.71-.29,1,1,0,0,0-.7.29l-.71.71a1,1,0,1,0,1.41,1.41l.71-.71A1,1,0,0,0,17,5.64ZM12,15a3,3,0,1,0,0-6A3,3,0,0,0,12,15Zm0,2a5,5,0,1,0,0-10A5,5,0,0,0,12,17Z"/></svg>
          <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22,8.27,8.27,0,0,1,15.92,12,8.1,8.1,0,0,1,12.14,19.73Z"/></svg>
        </label>
      </div>
    </header>
  );
};

export default Header;
