import Fr from './french.json';
import En from './english.json';
const translate = entry => {
      switch (localStorage.getItem('userLang')) {
            case 'fr':
                  return Fr[entry];

            case 'en':
                  return En[entry];

            default:
                  return entry;
      }
};

export const translateDataStoreLabel = elementObject => {
      if (!elementObject) return '';
      switch (localStorage.getItem('userLang')) {
            case 'fr':
                  return elementObject['name_fr'] || elementObject['name'];

            case 'en':
                  return elementObject['name'] || elementObject['name_fr'];

            default:
                  return elementObject['name'];
      }
};

export const getCurrentLangue = () => localStorage.getItem('userLang') || 'en';

export default translate;
