/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { findRoute } from './find';
import { httpServiceMock } from 'src/core/server/mocks';
import { mockHandlerArguments, fakeEvent } from './_mock_handler_arguments';
import { eventLogClientMock } from '../event_log_client.mock';
import { loggingSystemMock } from 'src/core/server/mocks';

const eventLogClient = eventLogClientMock.create();
const systemLogger = loggingSystemMock.createLogger();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('find', () => {
  it('finds events with proper parameters', async () => {
    const router = httpServiceMock.createRouter();

    findRoute(router, systemLogger);

    const [config, handler] = router.get.mock.calls[0];

    expect(config.path).toMatchInlineSnapshot(`"/internal/event_log/{type}/{id}/_find"`);

    const events = [fakeEvent(), fakeEvent()];
    const result = {
      page: 0,
      per_page: 10,
      total: events.length,
      data: events,
    };
    eventLogClient.findEventsBySavedObjectIds.mockResolvedValueOnce(result);

    const [context, req, res] = mockHandlerArguments(
      eventLogClient,
      {
        params: { id: '1', type: 'action' },
      },
      ['ok']
    );

    await handler(context, req, res);

    expect(eventLogClient.findEventsBySavedObjectIds).toHaveBeenCalledTimes(1);

    const [type, ids] = eventLogClient.findEventsBySavedObjectIds.mock.calls[0];
    expect(type).toEqual(`action`);
    expect(ids).toEqual(['1']);

    expect(res.ok).toHaveBeenCalledWith({
      body: result,
    });
  });

  it('supports optional pagination parameters', async () => {
    const router = httpServiceMock.createRouter();

    findRoute(router, systemLogger);

    const [, handler] = router.get.mock.calls[0];
    eventLogClient.findEventsBySavedObjectIds.mockResolvedValueOnce({
      page: 0,
      per_page: 10,
      total: 0,
      data: [],
    });

    const [context, req, res] = mockHandlerArguments(
      eventLogClient,
      {
        params: { id: '1', type: 'action' },
        query: { page: 3, per_page: 10 },
      },
      ['ok']
    );

    await handler(context, req, res);

    expect(eventLogClient.findEventsBySavedObjectIds).toHaveBeenCalledTimes(1);

    const [type, ids, options] = eventLogClient.findEventsBySavedObjectIds.mock.calls[0];
    expect(type).toEqual(`action`);
    expect(ids).toEqual(['1']);
    expect(options).toMatchObject({});

    expect(res.ok).toHaveBeenCalledWith({
      body: {
        page: 0,
        per_page: 10,
        total: 0,
        data: [],
      },
    });
  });

  it('logs a warning when the query throws an error', async () => {
    const router = httpServiceMock.createRouter();

    findRoute(router, systemLogger);

    const [, handler] = router.get.mock.calls[0];
    eventLogClient.findEventsBySavedObjectIds.mockRejectedValueOnce(new Error('oof!'));

    const [context, req, res] = mockHandlerArguments(
      eventLogClient,
      {
        params: { id: '1', type: 'action' },
        query: { page: 3, per_page: 10 },
      },
      ['ok']
    );

    await handler(context, req, res);

    expect(systemLogger.debug).toHaveBeenCalledTimes(1);
    expect(systemLogger.debug).toHaveBeenCalledWith(
      'error calling eventLog findEventsBySavedObjectIds(action, [1], {"page":3,"per_page":10}): oof!'
    );
  });
});
