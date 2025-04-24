import { useState, useEffect } from 'react';
import { loadDataStore } from '../utils/functions';

const useGetGroups = () => {
    const [dataStoreIndicators, setDataStoreIndicators] = useState([]);
    const [loadingIndicators, setLoadingIndicators] = useState(false);

    const loadDataStoreIndicators = async () => {
        try {
            setLoadingIndicators(true);
            const response = await loadDataStore(
                process.env.REACT_APP_INDICATORS_KEY,
                null,
                null,
                []
            );
            setDataStoreIndicators(response);
            setLoadingIndicators(false);
        } catch (err) {
            setLoadingIndicators(false);
        }
    };

    useEffect(() => {
        loadDataStoreIndicators();
    }, []);

    return {
        groups: dataStoreIndicators?.map(d => ({ name: d.name })) || [],
        loading: loadingIndicators
    };
};

export default useGetGroups;
