import axios from 'axios';
import { DATA_STORE_ROUTE } from './api.routes';

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
            console.log(err);
            throw err;
      }
};

export const getLetter = nbr => {
      // if (+nbr === 1) return 'A';
      // if (+nbr === 2) return 'B';
      // if (+nbr === 3) return 'C';
      return nbr;
};
