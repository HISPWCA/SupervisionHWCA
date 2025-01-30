import axios from 'axios';
import { DATA_STORE_ROUTE } from './api.routes';
import { v4 as uuid } from 'uuid';

export const loadDataStore = async (key_string, setLoading, setState, payload = null) => {
      try {
            if (!key_string) throw new Error('Veuillez préciser le key_string du datastore à récupérer');

            setLoading && setLoading(true);

            const route = `${DATA_STORE_ROUTE}/${process.env.REACT_APP_DATA_STORE_NAME}/${key_string}`;
            const response = await axios.get(route);
            const data = response.data;

            setState && setState(data);
            setLoading && setLoading(false);
            return data;
      } catch (err) {
            setLoading && setLoading(false);
            createDataToDataStore(key_string, payload ? payload : []);
            console.clear();
      }
};

export const saveDataToDataStore = async (key_string, payload, setLoading, setState, setErrorMessage) => {
      try {
            if (!key_string) throw new Error('Veuillez préciser le key_string du datastore à récupérer');

            if (!payload) throw new Error('Veuillez ajoutée le payload à sauvegarder dans le datastore !');

            setLoading && setLoading(true);

            const route = `${DATA_STORE_ROUTE}/${process.env.REACT_APP_DATA_STORE_NAME}/${key_string}`;
            const response = await axios.put(route, payload);
            const data = response.data;

            setState && setState(data);
            setLoading && setLoading(false);

            return true;
      } catch (err) {
            setErrorMessage && setErrorMessage(err.message);
            setLoading && setLoading(false);
            throw err;
      }
};

export const createDataToDataStore = async (key_string, payload) => {
      try {
            if (!key_string) throw new Error('Veuillez préciser le key_string du datastore à récupérer');

            const route = `${DATA_STORE_ROUTE}/${process.env.REACT_APP_DATA_STORE_NAME}/${key_string}`;
            await axios.post(route, payload || []);

            return true;
      } catch (err) {
            throw err;
      }
};

export const getLetter = nbr => {
      if (+nbr === 1) return 'A';
      if (+nbr === 2) return 'B';
      if (+nbr === 3) return 'C';
      if (+nbr === 4) return 'D';
      return nbr;
};

export const goToNewPage = url => {
      let a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('target', '_blanc');
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      a.remove();
};

/** === NUMBER === */
function isNumber(number) {
      return !isNaN(parseFloat(number));
}

/** === ARRAY === */
function isArray(array) {
      var isArray = Object.prototype.toString.call(array) === '[object Array]';

      return isArray;
}

function toArray(array) {
      var isArray = Object.prototype.toString.call(array) === '[object Array]';

      if (isArray) return array;
      else return [array];
}

const arrayMerge = (a, b) => {
      if (a && !isArray(a)) a = [a];
      if (b && !isArray(b)) b = [b];

      if (!a && b) return b;
      if (!b && a) return a;

      for (let i = 0; a && b && i < b.length; i++) {
            a.push(b[i]);
      }
      return a;
};

const arrayRemoveDuplicates = (array, property) => {
      var seen = {};
      return array.filter(function (item) {
            if (property) {
                  return seen.hasOwnProperty(item[property]) ? false : (seen[item[property]] = true);
            } else {
                  return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            }
      });
};

export const idsFromIndicatorFormula = (numeratorFormula, denominatorFormula, dataElementOnly) => {
      try {
            var matches = arrayMerge(numeratorFormula.match(/#{(.*?)}/g), denominatorFormula.match(/#{(.*?)}/g));
            if (!matches) return [];

            for (let i = 0; i < matches.length; i++) {
                  matches[i] = matches[i].slice(2, -1);
                  if (dataElementOnly) matches[i] = matches[i].split('.')[0];
            }

            return arrayRemoveDuplicates(matches);
      } catch (err) {
            console.log('Error: ', err);
            return [];
      }
};

export const modifierKeyInList = (groupList = []) => {
      return (
            groupList.map(group => ({
                  ...group,
                  children: group.children.map(child => ({
                        ...child,
                        name_fr: child.name_fr || '',
                        id: child.id || uuid()
                  }))
            })) || []
      );
};