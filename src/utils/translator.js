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
      console.log('elementObject.useNameFromDHIS2 ', elementObject?.useNameFromDHIS2);
      if (!elementObject) return '';
      switch (localStorage.getItem('userLang')) {
            case 'fr':
                  return elementObject.useNameFromDHIS2 === true
                        ? elementObject['indicatorRename_fr'] || elementObject['indicatorRename']
                        : elementObject['name_fr'] || elementObject['name'];

            case 'en':
                  return elementObject.useNameFromDHIS2 === true
                        ? elementObject['indicatorRename'] || elementObject['indicatorRename_fr']
                        : elementObject['name'] || elementObject['name_fr'];

            default:
                  return elementObject.useNameFromDHIS2 === true
                        ? elementObject['indicatorRename'] || elementObject['indicatorRename_fr']
                        : elementObject['name'];
      }
};

export const getCurrentLangue = () => localStorage.getItem('userLang') || 'en';

export default translate;
