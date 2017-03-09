function GetPropertySafely(prop, defaultValue) {
  return function getPropertySafely(thing) {
    if (thing[prop]) {
      return thing[prop];
    }
    else {
      return defaultValue;
    }
  };
}

module.exports = GetPropertySafely;
