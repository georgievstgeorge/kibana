/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiPanel, EuiTitle } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { useParams } from 'react-router-dom';
import { asPercent } from '../../../../../common/utils/formatters';
import { useFetcher } from '../../../../hooks/use_fetcher';
import { useTheme } from '../../../../hooks/use_theme';
import { useUrlParams } from '../../../../context/url_params_context/use_url_params';
import { callApmApi } from '../../../../services/rest/createCallApmApi';
import { TimeseriesChart } from '../timeseries_chart';

function yLabelFormat(y?: number | null) {
  return asPercent(y || 0, 1);
}

interface Props {
  height?: number;
  showAnnotations?: boolean;
}

export function TransactionErrorRateChart({
  height,
  showAnnotations = true,
}: Props) {
  const theme = useTheme();
  const { serviceName } = useParams<{ serviceName?: string }>();
  const { urlParams, uiFilters } = useUrlParams();

  const { start, end, transactionType, transactionName } = urlParams;

  const { data, status } = useFetcher(() => {
    if (serviceName && start && end) {
      return callApmApi({
        endpoint:
          'GET /api/apm/services/{serviceName}/transactions/charts/error_rate',
        params: {
          path: {
            serviceName,
          },
          query: {
            start,
            end,
            transactionType,
            transactionName,
            uiFilters: JSON.stringify(uiFilters),
          },
        },
      });
    }
  }, [serviceName, start, end, uiFilters, transactionType, transactionName]);

  const errorRates = data?.transactionErrorRate || [];

  return (
    <EuiPanel>
      <EuiTitle size="xs">
        <h2>
          {i18n.translate('xpack.apm.errorRate', {
            defaultMessage: 'Error rate',
          })}
        </h2>
      </EuiTitle>
      <TimeseriesChart
        id="errorRate"
        height={height}
        showAnnotations={showAnnotations}
        fetchStatus={status}
        timeseries={[
          {
            data: errorRates,
            type: 'linemark',
            color: theme.eui.euiColorVis7,
            hideLegend: true,
            title: i18n.translate('xpack.apm.errorRate.chart.errorRate', {
              defaultMessage: 'Error rate (avg.)',
            }),
          },
        ]}
        yLabelFormat={yLabelFormat}
        yDomain={{ min: 0, max: 1 }}
      />
    </EuiPanel>
  );
}
