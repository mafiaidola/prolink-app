'use client';

import { useApp } from '@/components/providers';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}
