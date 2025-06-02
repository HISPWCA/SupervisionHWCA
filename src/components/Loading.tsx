import { CircularLoader } from '@dhis2/ui';
import translate from '../utils/translator';

const Loading = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
        <CircularLoader small />
        <span> {translate('Chargement')} .... </span>
    </div>
);

export default Loading;
