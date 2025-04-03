/**
 * @fileoverview Web vitals reporting utility for performance monitoring
 */

import { ReportHandler } from 'web-vitals';

/**
 * Function to report web vitals metrics
 * @param {ReportHandler} onPerfEntry - Callback function to handle performance entries
 */
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals; 