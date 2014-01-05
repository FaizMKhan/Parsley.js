define('parsley/utils', function () {
  return {
    // Parsley DOM-API
    // returns object from dom attributes and values
    // if attr is given, returns bool if attr present in DOM or not
    attr: function ($element, namespace, checkAttr) {
      var attribute,
        obj = {},
        regex = new RegExp('^' + namespace, 'i');

      if ('undefined' === typeof $element || 'undefined' === typeof $element[0])
        return {};

      for (var i in $element[0].attributes) {
        attribute = $element[0].attributes[i];
        if ('undefined' !== typeof attribute && null !== attribute && attribute.specified && regex.test(attribute.name)) {
          if ('undefined' !== typeof checkAttr && new RegExp(checkAttr, 'i').test(attribute.name))
              return true;

          obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
        }
      }

      return 'undefined' === typeof checkAttr ? obj : false;
    },

    // Recursive object / array getter
    get: function (obj, path, placeholder) {
      var i = 0,
      paths = (path || '').split('.');

      while (this.isObject(obj) || this.isArray(obj)) {
        obj = obj[paths[i++]];
        if (i === paths.length)
          return obj || placeholder;
      }

      return placeholder;
    },

    // {foo: bar, bar: baz} => [{key: foo, value: bar}, {key: bar, value: baz}]
    keyValue: function (object) {
      var keyValue = [];

      for (var key in object)
        keyValue.push({
          key: key,
          value: object[key]
        });

      return 1 === keyValue.length ? keyValue[0] : keyValue;
    },

    makeObject: function () {
      var object = {};
      for (var i = 0; i < arguments.length; i += 2)
        object[arguments[i]] = arguments[i+1];

      return object;
    },

    hash: function (length) {
      return new String(Math.random()).substring(2, length ? length + 2 : 9);
    },

    /** Third party functions **/
    // Underscore isArray
    isArray: function (mixed) {
      return Object.prototype.toString.call(mixed) === '[object Array]';
    },

    // Underscore isObject
    isObject: function (mixed) {
      return mixed === Object(mixed);
    },

    // Zepto deserialize function
    deserializeValue: function (value) {
      var num
      try {
        return value ?
          value == "true" ||
          (value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value)
          : value;
      } catch (e) { return value; }
    },

    // Zepto camelize function
    camelize: function (str) {
      return str.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    },

    // Zepto dasherize function
    dasherize: function (str) {
      return str.replace(/::/g, '/')
             .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
             .replace(/([a-z\d])([A-Z])/g, '$1_$2')
             .replace(/_/g, '-')
             .toLowerCase();
    }
  };
});
