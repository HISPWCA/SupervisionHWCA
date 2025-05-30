import { useAlert } from '@dhis2/app-runtime';

const useNotification = () => {
    const { show, hide } = useAlert(
        ({ message }) => message,
        type => ({
            ...type,
            duration: 3000
        })
    );

    return {
        show,
        hide
    };
};

export default useNotification;
