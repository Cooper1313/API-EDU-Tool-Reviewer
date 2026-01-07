/**
 * This object is responsible for reading configuration values
 * from the script's properties. All setup functions have been removed
 * as configuration is now managed directly by the developer in Project Settings.
 */
var Config = (function () {
  const props = PropertiesService.getScriptProperties();
  return {
    get: function (name, fallback = null) {
      const value = props.getProperty(name);
      return (value === null || value === undefined) ? fallback : value;
    }
    // 'set' and 'list' functions are no longer needed for the end-user workflow.
  };
})();
