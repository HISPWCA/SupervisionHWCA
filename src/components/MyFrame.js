import { MAP } from '../utils/constants';

const MyFrame = (
  {
    base_url,
    id,
    orgUnitIDs,
    periods,
    style = {},
    type = MAP,
    targetLineValue,
    targetLineTitle,
    baseLineValue,
    baseLineTitle
  }
) => {
  const htmlStringForChart = `

        <!DOCTYPE html>
<html lang="en">

<head>
    
 <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Brazza bulletin</title>

        <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.1/dist/echarts.min.js"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.js"
                  integrity="sha256-Qw82+bXyGq6MydymqBxNPYTaUXXq7c8v3CwiYwLLNXU=" crossorigin="anonymous"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script>
        <script src="https://hispwca.org/d2libraries/analysis/chart.js"></script>
        <script src="../../../dhis-web-commons/javascripts/ext/ext-all.js"></script>
        <script src="https://hispwca.org/d2libraries/analysis/reporttable.js"></script>
        <script src="https://hispwca.org/d2libraries/analysis/map.js"></script>
        <!-- (map231.js) Tres import pour avoir la légende en couleur au niveau du report table -->
        <script src="https://hispwca.org/d2libraries/analysis/map231.js"></script>
        <script src="../../../dhis-web-commons/javascripts/openlayers/OpenLayers.js"></script>
        <script type="text/javascript" src="../../../dhis-web-commons/javascripts/moment/moment-with-langs.min.js"></script>
        <script type="text/javascript" src="https://momentjs.com/downloads/moment-with-locales.min.js"></script>


        <script src="https://unpkg.com/docx@6.0.0/build/index.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js"></script>
        <script src="https://unpkg.com/html2canvas@1.0.0-rc.7/dist/html2canvas.js"></script>

        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/simple-notify@0.5.5/dist/simple-notify.min.js"></script>
        <script
                  src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
        <script src="https://printjs-4de6.kxcdn.com/print.min.js"></script>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-notify@0.5.5/dist/simple-notify.min.css" />


  <style type="text/css">
    body {
      font-family: Georgia, sans-serif;
      color: #3b3b3b;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }

    .chart {
      border: 1px solid #ddd;
      margin: 10px;
    }

    .chart.wide {
      width: 550px;
      height: 800px;
    }

    .map {
      /* width: 550px;
            height: 800px;
             */
      width: 440px;
      height: 400px;
      border: 1px solid rgb(11, 132, 168);
    }

    .map.wide {
      /* width: 550px;
            height: 800px;  */

      width: 440px;
      height: 400px;
    }

    button.btn-export {
      background-color: #8ecae6;
      color: #000;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid #ccc;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
    }

    button.btn-export:hover {
      background-color: #219ebc;
      color: #fff;
    }
  </style>

        <!-------------------------------------------   CONFIGURATIONS    ----------------------->

                <script>

                  /* A ne pas Toucher (Très important) */
                  const VISUALIZATION_TYPE = {
                            CHART: "CHART",
                            MAP: "MAP",
                            PIVOT_TABLE: "PIVOT_TABLE"
                  }

                  /* A ne pas Toucher (Très important) */
                  const CHART_TYPE = {
                            COLUMN: 'column',
                            STACKEDCOLUMN: 'stackedcolumn',
                            BAR: 'bar',
                            STACKEDBAR: 'stackedbar',
                            LINE: 'line',
                            AREA: 'area',
                            PIE: 'radar',
                            RADAR: 'radar',
                            GAUGE: 'gauge'
                  }


                  /* C'est Ici vous allez generer vos charts ou maps */
                  function generate_views() {
                              loadVisualizationV2({
                                 el: '${id}',
                                ou: '${orgUnitIDs}'.split(','),
                                pe: '${periods}' ?  '${periods}'.split(',') : [],
                                targetLineValue: '${targetLineValue}' ?  +${targetLineValue} : null,
                                targetLineTitle: '${targetLineTitle}' ?  '${targetLineTitle}' : null,
                                baseLineValue:'${baseLineValue}' ?  +${baseLineValue} : null,
                                baseLineTitle: '${baseLineTitle}' ?  '${baseLineTitle}' : null,
                               })

                            /* ***********  FIN du Block de Travail  ******************** */
                  }

        </script>
        <!-------------------------------------------   CONFIGURATIONS END ----------------------->

        <script type="text/javascript">

                  /* Vous pouvez changer l'URL du Serveur ( l'instance DHIS2 ) */
                  const SERVEUR_URL = '${base_url}'




        /* A ne pas Toucher */
        const loadFavorite = async (el, baseUrl, username, password) => {
          try {
            const basePath = baseUrl.endsWith("/")
              ? baseUrl.slice(0, baseUrl.length - 1)
              : baseUrl;

            const routeVisualization =
              basePath +
              "/api/visualizations/" +
              el +
              ".json?fields=access,aggregationType,axes,colSubTotals,colTotals,colorSet,columns[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],completedOnly,created,cumulative,cumulativeValues,description,digitGroupSeparator,displayDensity,displayDescription,displayName,displayShortName,favorite,favorites,filters[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],fontSize,fontStyle,hideEmptyColumns,hideEmptyRowItems,hideEmptyRows,hideSubtitle,hideTitle,href,id,interpretations[id,created],lastUpdated,lastUpdatedBy,legend,legendDisplayStrategy,legendDisplayStyle,legendSet[id,name,displayName,displayShortName],measureCriteria,name,noSpaceBetweenColumns,numberType,outlierAnalysis,parentGraphMap,percentStackedValues,publicAccess,regression,regressionType,reportingParams,rowSubTotals,rowTotals,rows[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],series,shortName,showData,showDimensionLabels,showHierarchy,skipRounding,sortOrder,subscribed,subscribers,subtitle,timeField,title,topLimit,translations,type,user[name,displayName,displayShortName,userCredentials[username]],userAccesses,userGroupAccesses,yearlySeries,!attributeDimensions,!attributeValues,!category,!categoryDimensions,!categoryOptionGroupSetDimensions,!code,!columnDimensions,!dataDimensionItems,!dataElementDimensions,!dataElementGroupSetDimensions,!externalAccess,!filterDimensions,!itemOrganisationUnitGroups,!organisationUnitGroupSetDimensions,!organisationUnitLevels,!organisationUnits,!periods,!programIndicatorDimensions,!relativePeriods,!rowDimensions,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren";

            const routeMap =
              basePath +
              "/api/maps/" +
              el +
              ".json?fields=id,user,displayName~rename(name),description,longitude,latitude,zoom,basemap,publicAccess,created,lastUpdated,access,update,manage,delete,href,%20mapViews[*,columns[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],rows[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],filters[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],organisationUnits[id,path],dataDimensionItems,program[id,displayName~rename(name)],programStage[id,displayName~rename(name)],legendSet[id,displayName~rename(name)],trackedEntityType[id,displayName~rename(name)],organisationUnitSelectionMode,!href,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!sortOrder,!topLimit]";

            let headersOptions = {};

            // On recupere plutot la visualization
            let responseData = null;
            try {
              const responseVisualization = await axios.get(routeVisualization, {
                headers: headersOptions,
              });
              responseData = responseVisualization?.data;
            } catch (err) {
              // au cas contraire , c'est plutôt un map
              const responseMap = await axios.get(routeMap, {
                headers: headersOptions,
              });
              responseData = responseMap?.data;
            }

            return responseData;
          } catch (err) {}
        };

        /* A ne pas Toucher */
        const makeDynamicPayload = ({ payload, pe, ou, dx }) => {
          let columns = [];
          let rows = [];
          let filters = [];

          // columns
          if (payload?.columns?.length > 0) {
            columns = payload?.columns?.map((column) => {
              if (column?.dimension === "pe") {
                return {
                  ...column,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : column.items,
                };
              }

              if (column?.dimension === "ou") {
                return {
                  ...column,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : column.items,
                };
              }

              if (column?.dimension === "dx") {
                return {
                  ...column,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : column.items,
                };
              }

              return column;
            });
          } else {
          }

          //rows
          if (payload?.rows?.length > 0) {
            rows = payload?.rows?.map((row) => {
              if (row?.dimension === "pe") {
                return {
                  ...row,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : row.items,
                };
              }

              if (row?.dimension === "ou") {
                return {
                  ...row,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : row.items,
                };
              }

              if (row?.dimension === "dx") {
                return {
                  ...row,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : row.items,
                };
              }

              return row;
            });
          } else {
          }

          // filters
          if (payload?.filters?.length > 0) {
            filters = payload?.filters?.map((filterItem) => {
              if (filterItem?.dimension === "pe") {
                return {
                  ...filterItem,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "ou") {
                return {
                  ...filterItem,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "dx") {
                return {
                  ...filterItem,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : filterItem.items,
                };
              }

              return filterItem;
            });
          } else {
          }

          return {
            ...payload,
            columns,
            filters,
            rows,
          };
        };

        /* A ne pas Toucher */
        const makeDynamicPayloadForMap = ({ payload, pe, ou, dx }) => {
          let columns = [];
          let rows = [];
          let filters = [];

          // columns
          if (payload?.mapViews[0]?.columns?.length > 0) {
            columns = payload?.mapViews[0]?.columns?.map((column) => {
              if (column?.dimension === "pe") {
                return {
                  ...column,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : column.items,
                };
              }

              if (column?.dimension === "ou") {
                return {
                  ...column,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : column.items,
                };
              }

              if (column?.dimension === "dx") {
                return {
                  ...column,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : column.items,
                };
              }

              return column;
            });
          } else {
          }

          //rows
          if (payload?.mapViews[0]?.rows?.length > 0) {
            rows = payload?.mapViews[0]?.rows?.map((row) => {
              if (row?.dimension === "pe") {
                return {
                  ...row,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : row.items,
                };
              }

              if (row?.dimension === "ou") {
                return {
                  ...row,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : row.items,
                };
              }

              if (row?.dimension === "dx") {
                return {
                  ...row,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : row.items,
                };
              }

              return row;
            });
          } else {
          }

          // filters
          if (payload?.mapViews[0]?.filters?.length > 0) {
            filters = payload?.mapViews[0]?.filters?.map((filterItem) => {
              if (filterItem?.dimension === "pe") {
                return {
                  ...filterItem,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "ou") {
                return {
                  ...filterItem,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "dx") {
                return {
                  ...filterItem,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : filterItem.items,
                };
              }

              return filterItem;
            });
          } else {
          }

          return {
            ...payload,
            mapViews:
              payload?.mapViews?.length > 0
                ? [
                    {
                      ...payload.mapViews[0],
                      columns,
                      filters,
                      rows,
                    },
                  ]
                : [],
          };
        };

        const loadVisualizationV2 = async ({
          el,
          ou = [],
          dx = [],
          pe = [],
          server_url = SERVEUR_URL,
          username = null,
          password = null,
          measureCriteria = null,
		      targetLineValue = null,
          targetLineTitle = null,
          baseLineValue = null,
          baseLineTitle = null,

        }) => {
          try {
            chartPlugin.url = server_url;
            chartPlugin.loadingIndicator = true;

            reportTablePlugin.url = server_url;
            reportTablePlugin.loadingIndicator = true;

            mapPlugin.url = server_url;
            mapPlugin.loadingIndicator = true;



            if (
              username &&
              password &&
              username?.trim()?.length > 0 &&
              password?.trim()?.length > 0
            ) {
              chartPlugin.username = username;
              chartPlugin.password = password;

              reportTablePlugin.username = username;
              reportTablePlugin.password = password;

              mapPlugin.username = username;
              mapPlugin.password = password;
            }

            let favoriteData = null;

            favoriteData = await loadFavorite(el, server_url, username, password);

            if (!favoriteData) {
              throw new Error("Impossible de récupérer ce favorit");
            }

            let currentPlugin = chartPlugin;

            if (favoriteData.type === VISUALIZATION_TYPE.PIVOT_TABLE) {
              currentPlugin = reportTablePlugin;
            }

            if (!favoriteData.type || favoriteData.type === VISUALIZATION_TYPE.MAP) {
              currentPlugin = mapPlugin;
            }

          

            if (
              favoriteData.type?.length > 0 &&
              favoriteData.type !== VISUALIZATION_TYPE.MAP
            ) {
              favoriteData = {
                ...favoriteData,
                id: null,
                el: favoriteData.id,
                legendSet: favoriteData.legend?.set?.id
                  ? favoriteData.legend.set
                  : null,
              };
          
              favoriteData = makeDynamicPayload({
                payload: favoriteData,
                dx,
                pe,
                ou,
              });

            
            } else {

              favoriteData = {
                ...favoriteData,
                id: null,
                el: favoriteData.id,
              };

              favoriteData = makeDynamicPayloadForMap({
                payload: favoriteData,
                dx,
                pe,
                ou,
              });

            }

            if (!favoriteData) {
              throw new Error("Impossible de récupérer ce favorit");
            }

            if(targetLineTitle){
              favoriteData.targetLineTitle = targetLineTitle;
            }

            if(targetLineValue){
              favoriteData.targetLineValue = targetLineValue;
            }

            if(baseLineTitle){
              favoriteData.baseLineTitle = baseLineTitle;
            }

            if(baseLineValue){
              favoriteData.baseLineValue = baseLineValue;
            }

            currentPlugin.load(favoriteData);

          } catch (err) {
          }
        };
                
                  /* A ne pas Toucher */
                  Ext.onReady(function (event) {
                       generate_views(null, null, null)
                  })

                  
        </script>

</head>

      <body>
        <div id="${id}">Chart</div>
        <div id="my-legend"></div>
      </body>

</html>       
        `;

  const htmlStringForMAP = `

        <!DOCTYPE html>
<html lang="en">

<head>
    
 <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Brazza bulletin</title>

        <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.1/dist/echarts.min.js"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.js"
                  integrity="sha256-Qw82+bXyGq6MydymqBxNPYTaUXXq7c8v3CwiYwLLNXU=" crossorigin="anonymous"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script>
        <script src="https://hispwca.org/d2libraries/analysis/chart.js"></script>
        <script src="../../../dhis-web-commons/javascripts/ext/ext-all.js"></script>
        <script src="https://hispwca.org/d2libraries/analysis/reporttable.js"></script>
        <script src="https://hispwca.org/d2libraries/analysis/map.js"></script>
        <!-- (map231.js) Tres import pour avoir la légende en couleur au niveau du report table -->
        <script src="https://hispwca.org/d2libraries/analysis/map231.js"></script>
        <script src="../../../dhis-web-commons/javascripts/openlayers/OpenLayers.js"></script>
        <script type="text/javascript" src="../../../dhis-web-commons/javascripts/moment/moment-with-langs.min.js"></script>
        <script type="text/javascript" src="https://momentjs.com/downloads/moment-with-locales.min.js"></script>


        <script src="https://unpkg.com/docx@6.0.0/build/index.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js"></script>
        <script src="https://unpkg.com/html2canvas@1.0.0-rc.7/dist/html2canvas.js"></script>

        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/simple-notify@0.5.5/dist/simple-notify.min.js"></script>
        <script
                  src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.7/dist/loadingoverlay.min.js"></script>
        <script src="https://printjs-4de6.kxcdn.com/print.min.js"></script>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-notify@0.5.5/dist/simple-notify.min.css" />


  <style type="text/css">
    body {
      font-family: Georgia, sans-serif;
      color: #3b3b3b;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }

    .chart {
      border: 1px solid #ddd;
      margin: 10px;
    }

    .chart.wide {
      width: 550px;
      height: 800px;
    }

    .map {
      /* width: 550px;
            height: 800px;
             */
      width: 440px;
      height: 400px;
      border: 1px solid rgb(11, 132, 168);
    }

    .map.wide {
      /* width: 550px;
            height: 800px;  */

      width: 440px;
      height: 400px;
    }

    button.btn-export {
      background-color: #8ecae6;
      color: #000;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid #ccc;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
    }

    button.btn-export:hover {
      background-color: #219ebc;
      color: #fff;
    }
  </style>

        <!-------------------------------------------   CONFIGURATIONS    ----------------------->


                <script>

                  /* A ne pas Toucher (Très important) */
                  const VISUALIZATION_TYPE = {
                            CHART: "CHART",
                            MAP: "MAP",
                            PIVOT_TABLE: "PIVOT_TABLE"
                  }

                  /* A ne pas Toucher (Très important) */
                  const CHART_TYPE = {
                            COLUMN: 'column',
                            STACKEDCOLUMN: 'stackedcolumn',
                            BAR: 'bar',
                            STACKEDBAR: 'stackedbar',
                            LINE: 'line',
                            AREA: 'area',
                            PIE: 'radar',
                            RADAR: 'radar',
                            GAUGE: 'gauge'
                  }


                  /* C'est Ici vous allez generer vos charts ou maps */
                  function generate_views() {

                            loadVisualizationV2({
                                 el: '${id}',
                                ou: '${orgUnitIDs}'.split(','),
                                pe: '${periods}'.split(','),
                               })


                            /* ***********  FIN du Block de Travail  ******************** */
                  }

        </script>
        <!-------------------------------------------   CONFIGURATIONS END ----------------------->

        <script type="text/javascript">

                  /* Vous pouvez changer l'URL du Serveur ( l'instance DHIS2 ) */
                  const SERVEUR_URL = '${base_url}'



        /* A ne pas Toucher */
        const loadFavorite = async (el, baseUrl, username, password) => {
          try {
            const basePath = baseUrl.endsWith("/")
              ? baseUrl.slice(0, baseUrl.length - 1)
              : baseUrl;

            const routeVisualization =
              basePath +
              "/api/visualizations/" +
              el +
              ".json?fields=access,aggregationType,axes,colSubTotals,colTotals,colorSet,columns[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],completedOnly,created,cumulative,cumulativeValues,description,digitGroupSeparator,displayDensity,displayDescription,displayName,displayShortName,favorite,favorites,filters[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],fontSize,fontStyle,hideEmptyColumns,hideEmptyRowItems,hideEmptyRows,hideSubtitle,hideTitle,href,id,interpretations[id,created],lastUpdated,lastUpdatedBy,legend,legendDisplayStrategy,legendDisplayStyle,legendSet[id,name,displayName,displayShortName],measureCriteria,name,noSpaceBetweenColumns,numberType,outlierAnalysis,parentGraphMap,percentStackedValues,publicAccess,regression,regressionType,reportingParams,rowSubTotals,rowTotals,rows[dimension,filter,legendSet[id,name,displayName,displayShortName],items[dimensionItem~rename(id),name,displayName,displayShortName,dimensionItemType]],series,shortName,showData,showDimensionLabels,showHierarchy,skipRounding,sortOrder,subscribed,subscribers,subtitle,timeField,title,topLimit,translations,type,user[name,displayName,displayShortName,userCredentials[username]],userAccesses,userGroupAccesses,yearlySeries,!attributeDimensions,!attributeValues,!category,!categoryDimensions,!categoryOptionGroupSetDimensions,!code,!columnDimensions,!dataDimensionItems,!dataElementDimensions,!dataElementGroupSetDimensions,!externalAccess,!filterDimensions,!itemOrganisationUnitGroups,!organisationUnitGroupSetDimensions,!organisationUnitLevels,!organisationUnits,!periods,!programIndicatorDimensions,!relativePeriods,!rowDimensions,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren";

            const routeMap =
              basePath +
              "/api/maps/" +
              el +
              ".json?fields=id,user,displayName~rename(name),description,longitude,latitude,zoom,basemap,publicAccess,created,lastUpdated,access,update,manage,delete,href,%20mapViews[*,columns[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],rows[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],filters[dimension,filter,items[dimensionItem~rename(id),dimensionItemType,displayName~rename(name)]],organisationUnits[id,path],dataDimensionItems,program[id,displayName~rename(name)],programStage[id,displayName~rename(name)],legendSet[id,displayName~rename(name)],trackedEntityType[id,displayName~rename(name)],organisationUnitSelectionMode,!href,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!sortOrder,!topLimit]";

            let headersOptions = {};

            // On recupere plutot la visualization
            let responseData = null;
            try {
              const responseVisualization = await axios.get(routeVisualization, {
                headers: headersOptions,
              });
              responseData = responseVisualization?.data;
            } catch (err) {
              // au cas contraire , c'est plutôt un map
              const responseMap = await axios.get(routeMap, {
                headers: headersOptions,
              });
              responseData = responseMap?.data;
            }

            return responseData;
          } catch (err) {}
        };

        /* A ne pas Toucher */
        const makeDynamicPayload = ({ payload, pe, ou, dx }) => {
          let columns = [];
          let rows = [];
          let filters = [];

          // columns
          if (payload?.columns?.length > 0) {
            columns = payload?.columns?.map((column) => {
              if (column?.dimension === "pe") {
                return {
                  ...column,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : column.items,
                };
              }

              if (column?.dimension === "ou") {
                return {
                  ...column,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : column.items,
                };
              }

              if (column?.dimension === "dx") {
                return {
                  ...column,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : column.items,
                };
              }

              return column;
            });
          } else {
          }

          //rows
          if (payload?.rows?.length > 0) {
            rows = payload?.rows?.map((row) => {
              if (row?.dimension === "pe") {
                return {
                  ...row,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : row.items,
                };
              }

              if (row?.dimension === "ou") {
                return {
                  ...row,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : row.items,
                };
              }

              if (row?.dimension === "dx") {
                return {
                  ...row,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : row.items,
                };
              }

              return row;
            });
          } else {
          }

          // filters
          if (payload?.filters?.length > 0) {
            filters = payload?.filters?.map((filterItem) => {
              if (filterItem?.dimension === "pe") {
                return {
                  ...filterItem,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "ou") {
                return {
                  ...filterItem,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "dx") {
                return {
                  ...filterItem,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : filterItem.items,
                };
              }

              return filterItem;
            });
          } else {
          }

          return {
            ...payload,
            columns,
            filters,
            rows,
          };
        };

        /* A ne pas Toucher */
        const makeDynamicPayloadForMap = ({ payload, pe, ou, dx }) => {
          let columns = [];
          let rows = [];
          let filters = [];

          // columns
          if (payload?.mapViews[0]?.columns?.length > 0) {
            columns = payload?.mapViews[0]?.columns?.map((column) => {
              if (column?.dimension === "pe") {
                return {
                  ...column,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : column.items,
                };
              }

              if (column?.dimension === "ou") {
                return {
                  ...column,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : column.items,
                };
              }

              if (column?.dimension === "dx") {
                return {
                  ...column,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : column.items,
                };
              }

              return column;
            });
          } else {
          }

          //rows
          if (payload?.mapViews[0]?.rows?.length > 0) {
            rows = payload?.mapViews[0]?.rows?.map((row) => {
              if (row?.dimension === "pe") {
                return {
                  ...row,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : row.items,
                };
              }

              if (row?.dimension === "ou") {
                return {
                  ...row,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : row.items,
                };
              }

              if (row?.dimension === "dx") {
                return {
                  ...row,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : row.items,
                };
              }

              return row;
            });
          } else {
          }

          // filters
          if (payload?.mapViews[0]?.filters?.length > 0) {
            filters = payload?.mapViews[0]?.filters?.map((filterItem) => {
              if (filterItem?.dimension === "pe") {
                return {
                  ...filterItem,
                  items: pe?.length > 0 ? pe.map((p) => ({ id: p })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "ou") {
                return {
                  ...filterItem,
                  items: ou?.length > 0 ? ou.map((o) => ({ id: o })) : filterItem.items,
                };
              }

              if (filterItem?.dimension === "dx") {
                return {
                  ...filterItem,
                  items: dx?.length > 0 ? dx.map((d) => ({ id: d })) : filterItem.items,
                };
              }

              return filterItem;
            });
          } else {
          }

          return {
            ...payload,
            mapViews:
              payload?.mapViews?.length > 0
                ? [
                    {
                      ...payload.mapViews[0],
                      columns,
                      filters,
                      rows,
                    },
                  ]
                : [],
          };
        };

        const loadVisualizationV2 = async ({
          el,
          ou = [],
          dx = [],
          pe = [],
          server_url = SERVEUR_URL,
          username = null,
          password = null,
        }) => {
          try {
            chartPlugin.url = server_url;
            chartPlugin.loadingIndicator = true;

            reportTablePlugin.url = server_url;
            reportTablePlugin.loadingIndicator = true;

            mapPlugin.url = server_url;
            mapPlugin.loadingIndicator = true;



            if (
              username &&
              password &&
              username?.trim()?.length > 0 &&
              password?.trim()?.length > 0
            ) {
              chartPlugin.username = username;
              chartPlugin.password = password;

              reportTablePlugin.username = username;
              reportTablePlugin.password = password;

              mapPlugin.username = username;
              mapPlugin.password = password;
            }

            let favoriteData = null;

            favoriteData = await loadFavorite(el, server_url, username, password);

            if (!favoriteData) {
              throw new Error("Impossible de récupérer ce favorit");
            }

            let currentPlugin = chartPlugin;

            if (favoriteData.type === VISUALIZATION_TYPE.PIVOT_TABLE) {
              currentPlugin = reportTablePlugin;
            }

            if (!favoriteData.type || favoriteData.type === VISUALIZATION_TYPE.MAP) {
              currentPlugin = mapPlugin;
            }

          

            if (
              favoriteData.type?.length > 0 &&
              favoriteData.type !== VISUALIZATION_TYPE.MAP
            ) {
              favoriteData = {
                ...favoriteData,
                id: null,
                el: favoriteData.id,
                legendSet: favoriteData.legend?.set?.id
                  ? favoriteData.legend.set
                  : null,
              };
          
              favoriteData = makeDynamicPayload({
                payload: favoriteData,
                dx,
                pe,
                ou,
              });

            
            } else {

              favoriteData = {
                ...favoriteData,
                id: null,
                el: favoriteData.id,
              };

              favoriteData = makeDynamicPayloadForMap({
                payload: favoriteData,
                dx,
                pe,
                ou,
              });

            }

            if (!favoriteData) {
              throw new Error("Impossible de récupérer ce favorit");
            }


            currentPlugin.load(favoriteData);

          } catch (err) {
          }
        };

                
                  /* A ne pas Toucher */
                  Ext.onReady(function (event) {

                       generate_views(null, null, null)
                            
                  })

                  
        </script>

</head>

<body>
        <div class="map" id="${id}">Chart</div>
 
</body>

</html>
       
        `;

  return (
    <div>
      <iframe
        id={`${id}-iframe`}
        frameborder="0"
        srcDoc={type === MAP ? htmlStringForMAP : htmlStringForChart}
        style={{ height: '100%', width: '100%', ...style }}
      ></iframe>
    </div>
  );
};

export default MyFrame;
