/**
 *  This file holds a hook to get data for the crowdfunding campaign
 */

import { useState } from 'react';
// import $ from 'jquery';

/*
  States:
  - undefined
  - data
*/

export const useGetCrowdfundingDirectly = projectId => {
  const [crowdFunding, setCrowdFunding] = useState(() => {
    if (typeof window !== `undefined`) {
      Promise.all([
        loadScript('//api.startnext.com/js/cfapiclient-0.1.js'),
        import(/* webpackChunkName: "jquery" */ 'jquery'),
      ]).then(([, module]) => {
        const apiUrl = 'https://api.startnext.com';
        const clientOptions = {
          url: apiUrl,
          client_id: 1000000001,
          jquery: module.default,
          version: '1.2',
        };
        const apiClient = new cfAPIClient(clientOptions); // eslint-disable-line no-undef
        apiClient.get(
          '/projects/' + projectId,
          { lang: 'de' },
          (data, textStatus, jqXHR) => {
            setCrowdFunding(data);
          }
        );
      });
    }
  });
  return [crowdFunding];
};

// https://stackoverflow.com/questions/16839698/jquery-getscript-alternative-in-native-javascript
const loadScript = (source, beforeEl, async = true, defer = true) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== `undefined`) {
      let script = document.createElement('script');
      const prior = beforeEl || document.getElementsByTagName('script')[0];
      script.async = async;
      script.defer = defer;

      function onloadHander(_, isAbort) {
        if (
          isAbort ||
          !script.readyState ||
          /loaded|complete/.test(script.readyState)
        ) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;

          if (isAbort) {
            reject();
          } else {
            resolve();
          }
        }
      }

      script.onload = onloadHander;
      script.onreadystatechange = onloadHander;

      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    }
  });
};

export const buildVisualisationsWithCrowdfunding = visualisations => {
  if (!visualisations) {
    return [];
  }
  const visualisationsWithoutCrowdfunding = visualisations.filter(
    vis => !vis.startnextId
  );
  const startnextVisualisations = visualisations.filter(vis => vis.startnextId);

  // For all visualisations with startnext key, add project property with the crowdfunding data
  const visualisationsWithCrowdfunding = startnextVisualisations.map(vis => {
    const [crowdfunding] = useGetCrowdfundingDirectly(vis.startnextId);
    const { project } = crowdfunding ? crowdfunding : {};

    return {
      ...vis,
      project,
    };
  });

  return [
    ...visualisationsWithCrowdfunding,
    ...visualisationsWithoutCrowdfunding,
  ];
};
