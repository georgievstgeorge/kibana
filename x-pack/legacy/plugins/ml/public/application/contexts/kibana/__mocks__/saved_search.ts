/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { searchSourceMock } from '../../../../../../../../../src/legacy/ui/public/courier/search_source/mocks';

export const savedSearchMock = {
  id: 'the-saved-search-id',
  title: 'the-saved-search-title',
  searchSource: searchSourceMock,
  columns: [],
  sort: [],
  destroy: () => {},
};
