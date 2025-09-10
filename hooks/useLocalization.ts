import { useLanguage } from '../contexts/LanguageContext';
import { Story } from '../types';

export const useLocalization = () => {
  // FIX: Destructure `direction` from `useLanguage` to make it available to consumers of this hook.
  const { language, direction } = useLanguage();

  const getLocalizedStory = <T extends { content: Story['content'] }>(item: T) => {
    return item.content[language];
  };
  
  const getLocalizedTeacherResources = <T extends { teacherResources: Story['teacherResources'] }>(item: T) => {
    return item.teacherResources[language];
  };

  const t = (translations: { [key: string]: string }) => {
    return translations[language] || translations['en'];
  };

  // FIX: Add `direction` to the returned object.
  return { getLocalizedStory, getLocalizedTeacherResources, t, language, direction };
};
