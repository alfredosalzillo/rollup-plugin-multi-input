"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fastGlob = _interopRequireDefault(require("fast-glob"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var flatter = function flatter() {
  return function (acc, a) {
    return _toConsumableArray(acc).concat(_toConsumableArray(Array.isArray(a) ? a : [a]));
  };
};
/*
* multiInput return a rollup plugin config for enable support of multi-entry glob inputs
* */


var _default = function _default() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      glob = _ref.glob,
      _ref$relative = _ref.relative,
      relative = _ref$relative === void 0 ? 'src/' : _ref$relative;

  var formatName = function formatName(name) {
    return _path["default"].relative(relative, name).replace(/\.[^/.]+$/, '');
  };

  var options = function options(conf) {
    var input = conf.input;
    var reducedInput = [input].reduce(flatter(), []);
    var stringInputs = reducedInput.filter(function (name) {
      return typeof name === 'string';
    });
    var othersInputs = reducedInput.filter(function (name) {
      return typeof name !== 'string';
    });
    var inputGlobed = Object.assign.apply(Object, [{}].concat(_toConsumableArray(_fastGlob["default"].sync(stringInputs, glob).map(function (name) {
      return _defineProperty({}, formatName(name), name);
    }))));
    return _objectSpread({}, conf, {
      input: Object.assign.apply(Object, [inputGlobed].concat(_toConsumableArray(othersInputs)))
    });
  };

  return {
    options: options
  };
};

exports["default"] = _default;
