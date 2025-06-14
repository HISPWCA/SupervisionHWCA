import { Checkbox, Select } from 'antd';
import React from 'react';
import translate from '../utils/translator';
import { TRUE_ONLY } from '../utils/constants';

interface props {
    dataElement: {
        id: string;
        displayName: string;
        valueType: String;
        optionSet: { options: Array<{ displayName: string; code: string }>; id: string };
        optionSetValue: boolean;
    };
    value: any;
    onChange: (value: any) => void;
}

const GenerateFields = ({ dataElement, onChange, value }: props) => {
    if (dataElement?.optionSetValue && dataElement?.optionSet?.options?.length > 0) {
        return (
            <div style={{ marginTop: '10px', width: '100%' }}>
                <div>{dataElement?.displayName}</div>
                <div style={{ marginTop: '2px' }}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder={dataElement?.displayName}
                        value={value}
                        onChange={onChange}
                        options={dataElement?.optionSet?.options?.map(
                            (option: { code: string; displayName: string }) => ({
                                label: option.displayName,
                                value: option.code
                            })
                        )}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                    />
                </div>
            </div>
        );
    }

    if (!dataElement?.optionSetValue && dataElement?.valueType === TRUE_ONLY) {
        return (
            <div style={{ marginTop: '10px', width: '100%' }}>
                <Checkbox checked={value === 'true' ? true : false} onChange={(e: any) => onChange(e.target.checked)}>
                    <div>{dataElement?.displayName}</div>
                </Checkbox>
            </div>
        );
    }

    return (
        <>
            <div style={{ color: 'red', fontWeight: 'bold' }}>{translate('Element_Type_Not_Supported')}</div>
        </>
    );
};

export default GenerateFields;
