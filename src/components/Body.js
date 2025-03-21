import { CircularLoader, NoticeBox } from '@dhis2/ui';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ME_ROUTE, ME_SETTINGS_ROUTE, USER_GROUPS_ROUTE } from '../utils/api.routes';
import {
      PAGE_DASHBOARD,
      PAGE_SUPERVISIONS,
      PAGE_SETTINGS,
      PAGE_PAYMENT,
      PAGE_FAVORIS_CREATION,
      PAGE_SCHEDULE
} from '../utils/constants';
import { BORDER_COLOR } from '../utils/couleurs';
import { loadDataStore, modifierKeyInList, saveDataToDataStore } from '../utils/functions';
import DashboardSchedule from './DashboardSchedule';
import Dashboard from './Dashboard';
import Setting from './Setting';
import Supervision from './Supervision';
import { AiOutlineSetting } from 'react-icons/ai';
import { RxDashboard } from 'react-icons/rx';
import { GrSchedule } from 'react-icons/gr';

import { MdOutlineEditNote } from 'react-icons/md';
import translate from '../utils/translator';
import Payment from './Payment';
import Favorites from './Favorites';
import { MdStars } from 'react-icons/md';
import { v4 as uuid } from 'uuid';

import DE_Completness from '../datastores/DE_Completness.json';
import DS_Completness from '../datastores/DS_Completness.json';
import Cross_cuts from '../datastores/Cross_cuts.json';
import Indicators from '../datastores/Indicators.json';
import Registres from '../datastores/Registres.json';
import MetadataInfos from '../datastores/metadataInfos.json';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';

export const Body = () => {
      const [renderPage, setRenderPage] = useState(PAGE_DASHBOARD);
      const [isDataStoreInitialized, setDataStoreInitialized] = useState(false);
      const [errorMessage, setErrorMessage] = useState(null);
      const [me, setMe] = useState(null);

      const [loadingDataStoreInitialization, setLoadingDataStoreInitialization] = useState(false);
      const [_, setLoadingMe] = useState(false);

      const [appUserGroup, setAppUserGroup] = useState(null);
      const [appCreateFavoritUserGroup, setAppCreateFavoritUserGroup] = useState(null);

      const [updateMessages, setUpdateMessages] = useState([]);

      const updateBackgroundInformationsDataStore = async () => {
            try {
                  const backgroundInformationFavoriteList = await loadDataStore(
                        process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                        null,
                        null,
                        []
                  );
                  const indicatorsList = await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);
                  const crosschecksList = await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, []);
                  const registersList = await loadDataStore(process.env.REACT_APP_REGISTRES_KEY, null, null, []);
                  const deCompletnessList = await loadDataStore(
                        process.env.REACT_APP_DE_COMPLETNESS_KEY,
                        null,
                        null,
                        []
                  );
                  const dsCompletnessList = await loadDataStore(
                        process.env.REACT_APP_DS_COMPLETNESS_KEY,
                        null,
                        null,
                        []
                  );

                  if (backgroundInformationFavoriteList?.length > 0 && indicatorsList?.length > 0) {
                        console.log('backgroundInformationFavoriteList :', backgroundInformationFavoriteList);
                        await saveDataToDataStore(
                              process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY,
                              backgroundInformationFavoriteList?.map(favorite => ({
                                    ...favorite,
                                    formState: favorite.formState
                                          ? {
                                                  ...favorite.formState,
                                                  consistencyOvertimes:
                                                        favorite.formState?.consistencyOvertimes?.map(ind => ({
                                                              ...ind,
                                                              selectedSourceConsistency:
                                                                    (ind.selectedSourceConsistency &&
                                                                          indicatorsList
                                                                                ?.find(
                                                                                      group =>
                                                                                            group.name ===
                                                                                            favorite.formState
                                                                                                  .selectedGlobalProgramArea
                                                                                                  ?.name
                                                                                )
                                                                                ?.children?.find(
                                                                                      child =>
                                                                                            child.name ===
                                                                                                  ind
                                                                                                        .selectedSourceConsistency
                                                                                                        ?.name ||
                                                                                            child.name_fr ===
                                                                                                  ind
                                                                                                        .selectedSourceConsistency
                                                                                                        ?.name
                                                                                )) ||
                                                                    ind.selectedSourceConsistency
                                                        })) || [],
                                                  indicators:
                                                        favorite.formState?.indicators?.map(ind => ({
                                                              ...ind,
                                                              selectedSourceIndicator:
                                                                    (ind.selectedSourceIndicator &&
                                                                          indicatorsList
                                                                                ?.find(
                                                                                      group =>
                                                                                            group.name ===
                                                                                            favorite.formState
                                                                                                  .selectedGlobalProgramArea
                                                                                                  ?.name
                                                                                )
                                                                                ?.children?.find(
                                                                                      child =>
                                                                                            child.name ===
                                                                                                  ind
                                                                                                        .selectedSourceIndicator
                                                                                                        ?.name ||
                                                                                            child.name_fr ===
                                                                                                  ind
                                                                                                        .selectedSourceIndicator
                                                                                                        ?.name
                                                                                )) ||
                                                                    ind.selectedSourceIndicator
                                                        })) || [],

                                                  recoupements:
                                                        favorite.formState?.recoupements?.map(recoup => ({
                                                              ...recoup,
                                                              selectedSourcePrimary:
                                                                    (recoup.selectedSourcePrimary &&
                                                                          crosschecksList
                                                                                ?.find(
                                                                                      group =>
                                                                                            group.name ===
                                                                                            favorite.formState
                                                                                                  .selectedGlobalProgramArea
                                                                                                  ?.name
                                                                                )
                                                                                ?.children?.find(
                                                                                      child =>
                                                                                            child.name ===
                                                                                                  recoup
                                                                                                        .selectedSourcePrimary
                                                                                                        ?.name ||
                                                                                            child.name_fr ===
                                                                                                  recoup
                                                                                                        .selectedSourcePrimary
                                                                                                        ?.name
                                                                                )) ||
                                                                    recoup.selectedSourcePrimary,

                                                              selectedSourceSecondary:
                                                                    (recoup.selectedSourceSecondary &&
                                                                          crosschecksList
                                                                                ?.find(
                                                                                      group =>
                                                                                            group.name ===
                                                                                            favorite.formState
                                                                                                  .selectedGlobalProgramArea
                                                                                                  ?.name
                                                                                )
                                                                                ?.children?.find(
                                                                                      child =>
                                                                                            child.name ===
                                                                                                  recoup
                                                                                                        .selectedSourceSecondary
                                                                                                        ?.name ||
                                                                                            child.name_fr ===
                                                                                                  recoup
                                                                                                        .selectedSourceSecondary
                                                                                                        ?.name
                                                                                )) ||
                                                                    recoup.selectedSourceSecondary
                                                        })) || [],

                                                  completeness: favorite.formState?.completeness
                                                        ? {
                                                                ...favorite.formState?.completeness,
                                                                register: favorite.formState?.completeness?.register
                                                                      ? registersList
                                                                              ?.find(
                                                                                    group =>
                                                                                          group.name ===
                                                                                          favorite.formState
                                                                                                .selectedGlobalProgramArea
                                                                                                ?.name
                                                                              )
                                                                              ?.children?.find(
                                                                                    child =>
                                                                                          child.name ===
                                                                                                favorite.formState
                                                                                                      ?.completeness
                                                                                                      ?.register
                                                                                                      ?.name ||
                                                                                          child.name_fr ===
                                                                                                favorite.formState
                                                                                                      ?.completeness
                                                                                                      ?.register?.name
                                                                              ) ||
                                                                        favorite.formState?.completeness?.register
                                                                      : null,

                                                                sourceDocuments:
                                                                      favorite.formState?.completeness?.sourceDocuments?.map(
                                                                            sourceDoc => ({
                                                                                  ...sourceDoc,
                                                                                  selectedSourceDS:
                                                                                        sourceDoc.selectedSourceDS
                                                                                              ? dsCompletnessList
                                                                                                      ?.find(
                                                                                                            group =>
                                                                                                                  group.name ===
                                                                                                                  favorite
                                                                                                                        .formState
                                                                                                                        .selectedGlobalProgramArea
                                                                                                                        ?.name
                                                                                                      )
                                                                                                      ?.children?.find(
                                                                                                            child =>
                                                                                                                  child.name ===
                                                                                                                        sourceDoc
                                                                                                                              .selectedSourceDS
                                                                                                                              ?.name ||
                                                                                                                  child.name_fr ===
                                                                                                                        sourceDoc
                                                                                                                              .selectedSourceDS
                                                                                                                              ?.name
                                                                                                      ) ||
                                                                                                sourceDoc.selectedSourceDS
                                                                                              : null || null
                                                                            })
                                                                      ) || [],

                                                                dataElements:
                                                                      favorite.formState?.completeness?.dataElements?.map(
                                                                            sourceDE => ({
                                                                                  ...sourceDE,
                                                                                  selectedSourceDE:
                                                                                        sourceDE.selectedSourceDE
                                                                                              ? deCompletnessList
                                                                                                      ?.find(
                                                                                                            group =>
                                                                                                                  group.name ===
                                                                                                                  favorite
                                                                                                                        .formState
                                                                                                                        .selectedGlobalProgramArea
                                                                                                                        ?.name
                                                                                                      )
                                                                                                      ?.children?.find(
                                                                                                            child =>
                                                                                                                  child.name ===
                                                                                                                        sourceDE
                                                                                                                              .selectedSourceDE
                                                                                                                              ?.name ||
                                                                                                                  child.name_fr ===
                                                                                                                        sourceDE
                                                                                                                              .selectedSourceDE
                                                                                                                              ?.name
                                                                                                      ) ||
                                                                                                sourceDE.selectedSourceDE
                                                                                              : null || null
                                                                            })
                                                                      ) || []
                                                          }
                                                        : null
                                            }
                                          : null,
                                    configs: favorite.configs
                                          ? favorite.configs?.map(config => ({
                                                  ...config,
                                                  indicator: config.indicator
                                                        ? {
                                                                ...config.indicator,
                                                                id:
                                                                      [
                                                                            ...(indicatorsList?.find(
                                                                                  group =>
                                                                                        group.name ===
                                                                                        favorite.formState
                                                                                              .selectedGlobalProgramArea
                                                                                              ?.name
                                                                            )?.children || []),
                                                                            ...(crosschecksList?.find(
                                                                                  group =>
                                                                                        group.name ===
                                                                                        favorite.formState
                                                                                              .selectedGlobalProgramArea
                                                                                              ?.name
                                                                            )?.children || []),
                                                                            ...(registersList?.find(
                                                                                  group =>
                                                                                        group.name ===
                                                                                        favorite.formState
                                                                                              .selectedGlobalProgramArea
                                                                                              ?.name
                                                                            )?.children || []),
                                                                            ...(deCompletnessList?.find(
                                                                                  group =>
                                                                                        group.name ===
                                                                                        favorite.formState
                                                                                              .selectedGlobalProgramArea
                                                                                              ?.name
                                                                            )?.children || []),
                                                                            ...(dsCompletnessList?.find(
                                                                                  group =>
                                                                                        group.name ===
                                                                                        favorite.formState
                                                                                              .selectedGlobalProgramArea
                                                                                              ?.name
                                                                            )?.children || [])
                                                                      ]
                                                                            ?.reduce(
                                                                                  (prev, curr) => prev.concat(curr),
                                                                                  []
                                                                            )
                                                                            ?.find(
                                                                                  ind =>
                                                                                        ind.name ===
                                                                                              config.indicator?.id ||
                                                                                        ind.name_fr ===
                                                                                              config.indicator?.id
                                                                            )?.id || config.indicator?.id
                                                          }
                                                        : config.indicator
                                            }))
                                          : []
                              }))
                        );
                        setUpdateMessages(prev => [...prev, translate('Favoris_Mapping_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateIndicatorMappingDataStore = async () => {
            try {
                  const indicatorsMappingList = await loadDataStore(
                        process.env.REACT_APP_INDICATORS_MAPPING_KEY,
                        null,
                        null,
                        []
                  );

                  const indicatorsList = await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);

                  if (indicatorsMappingList?.length > 0 && indicatorsList?.length > 0) {
                        await saveDataToDataStore(
                              process.env.REACT_APP_INDICATORS_MAPPING_KEY,
                              indicatorsMappingList?.map(indMapping => ({
                                    ...indMapping,
                                    indicatorRename_fr: indMapping.indicatorRename_fr || '',
                                    indicator: indMapping.indicator
                                          ? indicatorsList
                                                  ?.find(group => group.name === indMapping.group)
                                                  ?.children?.find(
                                                        child =>
                                                              child.name === indMapping.indicator ||
                                                              child.name_fr === indMapping.indicator
                                                  )?.id || indMapping.indicator
                                          : null
                              }))
                        );
                        setUpdateMessages(prev => [...prev, translate('Indicator_Mapping_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateCrossCheckDataStore = async () => {
            try {
                  const crosschecksList = await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, []);
                  if (crosschecksList?.length > 0) {
                        await saveDataToDataStore(
                              process.env.REACT_APP_CROSS_CUT_KEY,
                              crosschecksList?.map(group => ({
                                    ...group,
                                    children:
                                          group.children?.map(child => ({
                                                ...child,
                                                id: child.id || uuid(),
                                                name_fr: child.name_fr || ''
                                          })) || []
                              }))
                        );
                        setUpdateMessages(prev => [...prev, translate('CrossCheck_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateIndicatorDataStore = async () => {
            try {
                  const indicatorsList = await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, []);
                  if (indicatorsList?.length > 0) {
                        await saveDataToDataStore(
                              process.env.REACT_APP_INDICATORS_KEY,
                              indicatorsList?.map(group => ({
                                    ...group,
                                    children:
                                          group.children?.map(child => ({
                                                ...child,
                                                id: child.id || uuid(),
                                                name_fr: child.name_fr || ''
                                          })) || []
                              }))
                        );

                        setUpdateMessages(prev => [...prev, translate('Indicator_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateRegistersDataStore = async () => {
            try {
                  const registersList = await loadDataStore(process.env.REACT_APP_REGISTRES_KEY, null, null, []);
                  if (registersList?.length > 0) {
                        await saveDataToDataStore(
                              process.env.REACT_APP_REGISTRES_KEY,
                              registersList?.map(group => ({
                                    ...group,
                                    children:
                                          group.children?.map(child => ({
                                                ...child,
                                                id: child.id || uuid(),
                                                name_fr: child.name_fr || ''
                                          })) || []
                              }))
                        );
                        setUpdateMessages(prev => [...prev, translate('Registers_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateDECompletessDataStore = async () => {
            try {
                  const deCompletnessList = await loadDataStore(
                        process.env.REACT_APP_DE_COMPLETNESS_KEY,
                        null,
                        null,
                        []
                  );
                  if (deCompletnessList?.length > 0) {
                        await saveDataToDataStore(
                              process.env.REACT_APP_DE_COMPLETNESS_KEY,
                              deCompletnessList?.map(group => ({
                                    ...group,
                                    children:
                                          group.children?.map(child => ({
                                                ...child,
                                                id: child.id || uuid(),
                                                name_fr: child.name_fr || ''
                                          })) || []
                              }))
                        );

                        setUpdateMessages(prev => [...prev, translate('DataElement_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateDSCompletnessDataStore = async () => {
            try {
                  const dsCompletnessList = await loadDataStore(
                        process.env.REACT_APP_DS_COMPLETNESS_KEY,
                        null,
                        null,
                        []
                  );

                  if (dsCompletnessList?.length > 0) {
                        await saveDataToDataStore(
                              process.env.REACT_APP_DS_COMPLETNESS_KEY,
                              dsCompletnessList?.map(group => ({
                                    ...group,
                                    children:
                                          group.children?.map(child => ({
                                                ...child,
                                                id: child.id || uuid(),
                                                name_fr: child.name_fr || ''
                                          })) || []
                              }))
                        );

                        setUpdateMessages(prev => [...prev, translate('DocumentSource_Updating')]);
                  }
            } catch (err) {
                  console.log(err);
            }
      };

      const updateDatastoreSchemas = async () => {
            try {
                  const metaData = await loadDataStore(process.env.REACT_APP_META_INFOS_NAME, null, null, []);
                  if (!metaData?.dataStoreSchemaIsUpdated || metaData?.dataStoreSchemaIsUpdated === 'false') {
                        await updateIndicatorDataStore();
                        await updateCrossCheckDataStore();
                        await updateDECompletessDataStore();
                        await updateDSCompletnessDataStore();
                        await updateRegistersDataStore();
                        await updateIndicatorMappingDataStore();
                        await updateBackgroundInformationsDataStore();

                        await saveDataToDataStore(process.env.REACT_APP_META_INFOS_NAME, {
                              ...metaData,
                              metadata_version: process.env.REACT_APP_META_DATA_VERSION,
                              dataStoreSchemaIsUpdated: true
                        });
                  }
            } catch (err) {
                  console.log('Error : ', err);
            }
      };

      const initDataStore = async () => {
            try {
                  setLoadingDataStoreInitialization(true);
                  loadUserSettings();
                  await loadDataStore(process.env.REACT_APP_SUPERVISIONS_CONFIG_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_INDICATORS_CONFIG_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_SUPERVISIONS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_ANALYSES_CONFIG_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_PERFORMANCE_FAVORITS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_BACKGROUND_INFORMATION_FAVORITS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_MISSIONS_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_VISUALIZATION_KEY, null, null, []);
                  await loadDataStore(process.env.REACT_APP_CROSS_CUT_KEY, null, null, modifierKeyInList(Cross_cuts));
                  await loadDataStore(process.env.REACT_APP_INDICATORS_KEY, null, null, modifierKeyInList(Indicators));
                  await loadDataStore(process.env.REACT_APP_REGISTRES_KEY, null, null, modifierKeyInList(Registres));
                  await loadDataStore(
                        process.env.REACT_APP_DE_COMPLETNESS_KEY,
                        null,
                        null,
                        modifierKeyInList(DE_Completness)
                  );
                  await loadDataStore(
                        process.env.REACT_APP_DS_COMPLETNESS_KEY,
                        null,
                        null,
                        modifierKeyInList(DS_Completness)
                  );
                  await loadDataStore(process.env.REACT_APP_INDICATORS_MAPPING_KEY, null, null, []);
                  await loadDataStore(
                        process.env.REACT_APP_META_INFOS_NAME,
                        null,
                        null,
                        MetadataInfos && {
                              ...MetadataInfos,
                              metadata_version: process.env.REACT_APP_META_DATA_VERSION,
                              dataStoreSchemaIsUpdated: true
                        }
                  );
                  await loadDataStore(process.env.REACT_APP_PERIODS_CONFIG_KEY, null, null, {
                        periods: [],
                        month1KeyWords: [],
                        month2KeyWords: [],
                        month3KeyWords: [],
                        month4KeyWords: [],
                        month5KeyWords: [],
                        month6KeyWords: [],
                        month7KeyWords: [],
                        month8KeyWords: [],
                        month9KeyWords: [],
                        month10KeyWords: [],
                        month11KeyWords: [],
                        month12KeyWords: [],
                        month13KeyWords: [],
                        month14KeyWords: [],
                        month15KeyWords: []
                  });
                  await loadDataStore(process.env.REACT_APP_GLOBAL_SETTING_KEY, null, null, {
                        DQR: {
                              nbrIndicator: 5,
                              nbrRecoupement: 3,
                              nbrConsistencyOverTime: 1,
                              nbrDataElementCompleteness: 6,
                              nbrSourceDocumentCompleteness: 7
                        },
                        ERDQ: { nbrIndicator: 3, nbrRecoupement: 3 }
                  });

                  await updateDatastoreSchemas();

                  await loadMe();
                  setDataStoreInitialized(true);
                  setLoadingDataStoreInitialization(false);
            } catch (err) {
                  setErrorMessage(err?.response?.data?.message || err.message);
                  setLoadingDataStoreInitialization(false);
            }
      };

      const initAppUserGroup = async () => {
            try {
                  const existedGroup = await axios.get(
                        `${USER_GROUPS_ROUTE}.json?fields=id&filter=name:eq:${process.env.REACT_APP_USER_GROUP}`
                  );
                  if (existedGroup.data?.userGroups?.length === 0) {
                        await axios.post(`${USER_GROUPS_ROUTE}.json`, { name: process.env.REACT_APP_USER_GROUP });
                        const createdUserGroup = await axios.get(
                              `${USER_GROUPS_ROUTE}.json?fields=id&filter=name:eq:${process.env.REACT_APP_USER_GROUP}`
                        );

                        if (createdUserGroup.data.userGroups.length === 0) {
                              throw new Error('User group creation error !');
                        }
                        setAppUserGroup(createdUserGroup.data.userGroups[0]);
                  } else {
                        setAppUserGroup(existedGroup.data.userGroups[0]);
                  }
            } catch (err) {
                  setErrorMessage(err?.response?.data?.message || err.message);
            }
      };

      const initAppCreateFavoritUserGroup = async () => {
            try {
                  const existedGroup = await axios.get(
                        `${USER_GROUPS_ROUTE}.json?fields=id&filter=name:eq:${process.env.REACT_APP_FAVORIT_USER_GROUP}`
                  );
                  if (existedGroup.data?.userGroups?.length === 0) {
                        await axios.post(`${USER_GROUPS_ROUTE}.json`, {
                              name: process.env.REACT_APP_FAVORIT_USER_GROUP
                        });
                        const createdUserGroup = await axios.get(
                              `${USER_GROUPS_ROUTE}.json?fields=id&filter=name:eq:${process.env.REACT_APP_FAVORIT_USER_GROUP}`
                        );

                        if (createdUserGroup.data.userGroups.length === 0) {
                              throw new Error('User group creation error !');
                        }
                        setAppCreateFavoritUserGroup(createdUserGroup.data.userGroups[0]);
                  } else {
                        setAppCreateFavoritUserGroup(existedGroup.data.userGroups[0]);
                  }
            } catch (err) {
                  setErrorMessage(err?.response?.data?.message || err.message);
            }
      };

      const loadMe = async () => {
            try {
                  setLoadingMe(true);
                  const meResponse = await axios.get(
                        `${ME_ROUTE},username,organisationUnits[id,displayName],authorities,userGroups`
                  );
                  setMe(meResponse.data);
                  setLoadingMe(false);
            } catch (err) {
                  setLoadingMe(false);
                  throw err;
            }
      };

      const loadUserSettings = async () => {
            try {
                  const response = await axios.get(`${ME_SETTINGS_ROUTE}`);
                  localStorage.setItem('userLang', response.data?.keyUiLocale ? response.data?.keyUiLocale : 'fr');
            } catch (err) {
                  throw err;
            }
      };

      const handleClickMenu = currentRenderPage => {
            setRenderPage(currentRenderPage);
      };

      const isAuthorisedForSetting = () => {
            if (me) {
                  if (me.authorities?.includes('ALL')) return true;

                  if (me.userGroups?.map(uGrp => uGrp.id)?.includes(appUserGroup?.id)) return true;
            }
            return false;
      };

      const isAuthorisedForFavorit = () => {
            if (me) {
                  if (me.authorities?.includes('ALL')) return true;

                  if (me.userGroups?.map(uGrp => uGrp.id)?.includes(appCreateFavoritUserGroup?.id)) return true;
            }
            return false;
      };

      const RenderMenu = () => (
            <div
                  style={{
                        borderRight: `1px solid ${BORDER_COLOR}`,
                        width: '250px',
                        height: '100%',
                        padding: '2px 0px',
                        position: 'relative'
                  }}
            >
                  <div
                        className={`menu-item ${renderPage === PAGE_DASHBOARD ? 'active' : ''}`}
                        onClick={_ => handleClickMenu(PAGE_DASHBOARD)}
                  >
                        <span>
                              <RxDashboard style={{ fontSize: '22px' }} />
                        </span>
                        <span style={{ marginLeft: '10px' }}>{translate('Dashboard')}</span>
                  </div>
                  <div
                        className={`menu-item ${renderPage === PAGE_SCHEDULE ? 'active' : ''}`}
                        onClick={_ => handleClickMenu(PAGE_SCHEDULE)}
                  >
                        <span>
                              <GrSchedule style={{ fontSize: '22px' }} />
                        </span>
                        <span style={{ marginLeft: '10px' }}>{translate('Supervision_Schedule')}</span>
                  </div>

                  <div
                        className={`menu-item ${renderPage === PAGE_SUPERVISIONS ? 'active' : ''}`}
                        onClick={_ => handleClickMenu(PAGE_SUPERVISIONS)}
                  >
                        <span>
                              <MdOutlineEditNote style={{ fontSize: '22px' }} />
                        </span>
                        <span style={{ marginLeft: '10px' }}>{translate('Planifications')}</span>
                  </div>

                  {isAuthorisedForFavorit() && (
                        <div
                              className={`menu-item ${renderPage === PAGE_FAVORIS_CREATION ? 'active' : ''}`}
                              onClick={_ => handleClickMenu(PAGE_FAVORIS_CREATION)}
                        >
                              <span>
                                    <MdStars style={{ fontSize: '22px' }} />
                              </span>
                              <span style={{ marginLeft: '10px' }}>{translate('Create_Favorites')}</span>
                        </div>
                  )}

                  {isAuthorisedForSetting() && (
                        <div
                              className={`menu-item ${renderPage === PAGE_SETTINGS ? 'active' : ''}`}
                              onClick={_ => handleClickMenu(PAGE_SETTINGS)}
                        >
                              <span>
                                    <AiOutlineSetting style={{ fontSize: '22px' }} />
                              </span>
                              <span style={{ marginLeft: '10px' }}>{translate('Parametres')}</span>
                        </div>
                  )}

                  <div
                        style={{
                              fontSize: '10px',
                              position: 'absolute',
                              bottom: '0px',
                              textAlign: 'center',
                              color: '#00000080',
                              marginBottom: '10px',
                              width: '100%'
                        }}
                  >
                        <a target="_blank" href="https://hispwca.org/hispwca/">
                              <span style={{ marginRight: '10px' }}>Hisp West and Central Africa</span>( Version :{' '}
                              {process.env.REACT_APP_VERSION} )
                        </a>
                  </div>
            </div>
      );

      const RenderContent = () => {
            switch (renderPage) {
                  case PAGE_DASHBOARD:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Dashboard me={me} />
                              </div>
                        );

                  case PAGE_SCHEDULE:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <DashboardSchedule me={me} />
                              </div>
                        );

                  case PAGE_PAYMENT:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Payment me={me} />
                              </div>
                        );

                  case PAGE_SUPERVISIONS:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Supervision me={me} />
                              </div>
                        );

                  case PAGE_FAVORIS_CREATION:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Favorites me={me} />
                              </div>
                        );

                  case PAGE_SETTINGS:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Setting me={me} />
                              </div>
                        );

                  default:
                        return (
                              <div
                                    className="my-scrollable"
                                    style={{ height: '100%', width: '100%', overflowY: 'scroll' }}
                              >
                                    <Dashboard me={me} />
                              </div>
                        );
            }
      };

      useEffect(() => {
            initAppUserGroup();
            initAppCreateFavoritUserGroup();
            initDataStore();
      }, []);

      return (
            <>
                  <div className="app">
                        {loadingDataStoreInitialization && (
                              <div
                                    className="my-shadow"
                                    style={{
                                          display: 'flex',
                                          // alignItems: 'center',
                                          maxWidth: '500px',
                                          padding: '10px',
                                          background: '#fff',
                                          borderRadius: '5px',
                                          margin: '10px auto'
                                    }}
                              >
                                    <CircularLoader small />
                                    <div style={{ marginLeft: '20px' }}>
                                          <div> {translate('Config_Initialization')}...</div>
                                          {updateMessages?.map(message => (
                                                <div
                                                      key={message}
                                                      style={{ display: 'flex', gap: '5px', marginTop: '10px' }}
                                                >
                                                      <span>{message}</span>
                                                      <span>
                                                            <IoCheckmarkDoneCircle style={{ color: 'green' }} />
                                                      </span>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        )}
                        {isDataStoreInitialized && (
                              <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                                    {RenderMenu()}
                                    {RenderContent()}
                              </div>
                        )}

                        {errorMessage && (
                              <div style={{ margin: '30px auto', maxWidth: '500px' }}>
                                    <NoticeBox error title="Initialisation du dataStore">
                                          {errorMessage}
                                    </NoticeBox>
                              </div>
                        )}
                  </div>
            </>
      );
};

export default Body;
