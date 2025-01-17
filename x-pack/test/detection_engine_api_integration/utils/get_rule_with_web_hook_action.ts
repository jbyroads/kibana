/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  CreateRulesSchema,
  UpdateRulesSchema,
} from '../../../plugins/security_solution/common/detection_engine/schemas/request';
import { getSimpleRule } from './get_simple_rule';

export const getRuleWithWebHookAction = (
  id: string,
  enabled = false,
  rule?: CreateRulesSchema
): CreateRulesSchema | UpdateRulesSchema => {
  const finalRule = rule != null ? { ...rule, enabled } : getSimpleRule('rule-1', enabled);
  return {
    ...finalRule,
    throttle: 'rule',
    actions: [
      {
        group: 'default',
        id,
        params: {
          body: '{}',
        },
        action_type_id: '.webhook',
      },
    ],
  };
};
