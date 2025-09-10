import React from 'react';
import { Link } from 'react-router-dom';
// FIX: The useLanguage hook does not provide the 't' function for translations.
// Replaced with useLocalization which provides both 'direction' and 't'.
import { useLocalization } from '../hooks/useLocalization';

const Footer: React.FC = () => {
  const { direction, t } = useLocalization();
  
  const translations = {
    explorers: { fr: 'Explorateurs', en: 'Explorers', ar: 'المستكشفون' },
    educators: { fr: 'Éducateurs', en: 'Educators', ar: 'المعلمون' },
  };

  return (
    <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded" dir={direction}>
      <nav className="grid grid-flow-col gap-4">
        <Link to="/home" className="link link-hover">{t(translations.explorers)}</Link>
        <Link to="/educators" className="link link-hover">{t(translations.educators)}</Link>
      </nav> 
      <aside>
        <p>&copy; {new Date().getFullYear()} Robot Explorers - All rights reserved.</p>
      </aside>
    </footer>
  );
};

export default Footer;