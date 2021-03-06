'use strict';

const utils = require('./utils');

describe('lib/utils', () => {
  test('the module exports the expected', () => {
    expect(utils).toEqual({
      fileExists: expect.any(Function),
      loadConfig: expect.any(Function),
      loadJsonFile: expect.any(Function),
      pathFromCwd: expect.any(Function),
      storeJsonFile: expect.any(Function)
    });
  });
});
