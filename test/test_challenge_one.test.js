const { someComplexFunction } = require('../challenge/one/challenge_one.js');
describe('Test someComplexFunction', () => {
    test('Console log should have been called', () => {
      const logSpy = jest.spyOn(global.console, 'log');

      someComplexFunction();

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Hello World');

      logSpy.mockRestore();
    });
  });