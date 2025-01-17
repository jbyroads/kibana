/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { RulePreviewLogs } from '../../../plugins/security_solution/common/detection_engine/schemas/request';

/**
 * This is the typical output of a simple rule preview, with errors and warnings coming up from the rule
 * execution process and a `previewId` generated server side for later preview querying
 *
 * @param previewId Rule id generated by the server itself
 * @param logs Errors and warnings returned by executor and route file, defaults to empty array
 */
export const getSimpleRulePreviewOutput = (
  previewId = undefined,
  logs: RulePreviewLogs[] = []
) => ({
  logs,
  previewId,
  isAborted: false,
});
