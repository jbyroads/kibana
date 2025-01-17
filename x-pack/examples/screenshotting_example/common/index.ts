/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ScreenshotResult } from '../../../plugins/screenshotting/server';

export interface ScreenshottingExpressionResponse {
  errors?: string[];
  image?: string;
  metrics?: ScreenshotResult['metrics'];
}

export const API_ENDPOINT = '/api/examples/screenshotting/expression';
