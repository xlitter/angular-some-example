angular.module('sn.validate', [])
//自定义验证, 支持特定事件触发验证
  .directive('nameCheck', ['$q', function ($q) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {},
      link: function (scope, element, attr, ctrl) {
        var defaultProps = {
          validators: {
            cLen: {
              fn: function (modelValue) {
                modelValue = modelValue || '';
                if (modelValue.length >= 9 && modelValue.length < 20) {
                  return true;
                }
                return false;
              },
              validateOn: 'blur'

            },
            cChar: {
              fn: function (modelValue) {
                return true;
              },
              validateOn: 'blur'
            },
            unique: {
              fn: function (modelValue) {
                var defer = $q.defer();
                setTimeout(function () {
                  var rand = Math.floor(Math.random() * 100),
                    method = rand > 50 ? 'resolve' : 'reject';
                  defer[method]();
                }, 1500);
                return defer.promise;
              },
              async: true,
              validateOn: 'blur'
            },
            validate: {
              fn: function (modelValue) {
                var defer = $q.defer();
                setTimeout(function () {
                  var rand = Math.floor(Math.random() * 100),
                    method = rand > 50 ? 'resolve' : 'reject';
                  defer[method]();
                }, 1500);
                return defer.promise;
              },
              async: true,
              validateOn: 'blur'
            }
          }
        },
          blurValidators = {},
          blurAsyncValidators = {},
          props,
          validatorFn;

        props = angular.extend({}, defaultProps);

        function bindFocus() {
          element.on('focus', function () {
            scope.$apply(function () {
              ctrl.$untouched = true;
              ctrl.$touched = false;
            });
          });
        }

        function bindBlur() {
          if (Object.keys(blurAsyncValidators).length > 0) {
            ctrl.$userPending = {};
          }

          function checkAsyncPending() {
            return Object.keys[ctrl.$pending].every(function (k) {
              return !ctrl.$pending[k];
            });
          }

          element.on('blur', function () {
            var modelValue = ctrl.$viewValue,
              viewValue = ctrl.$viewValue,
              name = ctrl.$name;

            angular.forEach(blurValidators, function (fn, key) {
              ctrl.$setValidity(key, fn(modelValue, viewValue, name));
            });

            angular.forEach(blurAsyncValidators, function (fn, key) {
              ctrl.$userPending[key] = true;
              fn(modelValue, viewValue, name).then(function () {
                ctrl.$setValidity(key, true);
              }, function () {
                ctrl.$setValidity(key, false);
              })['finally'](function () {
                var flag;
                ctrl.$userPending[key] = false;
              });
            })

          });
        }

        angular.forEach((props.validators || {}), function (validator, key) {
          var fn = validator.fn || angular.noop,
            validateOn = validator.validateOn || 'default',
            async = !!validator.async;
          validatorFn = async ? function (modelValue, viewValue) {
            var expression = fn(modelValue, viewValue, ctrl.$name);
            if (angular.isObject(expression) && angular.isFunction(expression.then)) {
              return expression;
            } else {
              return $q(function (resolve, reject) {
                setTimeout(function () {
                  if (expression) {
                    resolve();
                  } else {
                    reject();
                  }
                }, 0);
              });
            }
          } : function (modelValue, viewValue) {
            var expression = fn(modelValue, viewValue, ctrl.$name);

            if (angular.isObject(expression) && angular.isFunction(expression.then)) {
              expression.then(function () {
                ctrl.$setValidity(key, true);
              }, function () {
                ctrl.$setValidity(key, false);
              });
              return false;
            } else {
              return expression;
            }
          };
          if (validateOn === 'default') {
            if (!async) {
              ctrl.$validators[key] = validatorFn;
            } else {
              ctrl.$asyncValidators[key] = validatorFn;
            }

          } else if (validateOn === 'blur') {
            if (!async) {
              blurValidators[key] = validatorFn;
            } else {
              blurAsyncValidators[key] = validatorFn;
            }
          }
        });


        function init() {
          bindFocus();
          bindBlur();
        }

        init();
      }
    }
  }])
  .directive('buyCntButton', [function () {
    var FROM_MANUAL = 'manual';
    return {
      restrict: 'A',
      template: '<span class="input-group-btn-buy">'
      + '<button type="button" class="btn btn-info btn-minus" ng-click="minus()"></button>'
      + '</span>'
      + '<input type="text" name="cnt" class="input-group-text text-center" autocomplete="off"'
      + 'ng-blur="blur()" ng-focus="focus()" ng-model="formData.cnt">'
      + '<span class="input-group-btn-buy">'
      + '<button type="button" class="btn btn-info btn-plus" ng-click="plus()"></button>'
      + '</span>'
      + '<ng-messages for="formData.errors" class="err-message" style="margin-left:5px;">'
      + '  <ng-message when="minus">{{formData.messages.minus}}</ng-message>'
      + '  <ng-message when="plus">{{formData.messages.plus}}</ng-message>'
      + '</ng-messages>',
      scope: {
        buyCntButton: '=',
        setBuyCnt: '='
      },
      link: function (scope, element, attrs) {
        var vm = scope,
          formData = vm.formData = {},
          defaultOptions = {
            min: 1,
            max: 10
          },
          options,
          setBuyCnt = scope.setBuyCnt || angular.noop;

        function resetErrors() {
          formData.errors = {
            plus: false,
            minus: false
          };
        }

        function validateCnt(cnt, from) {
          var min = options.min,
            max = options.max;

          resetErrors();
          if (cnt < min) {
            cnt = min;
            formData.errors.minus = true;
          } else if (cnt > max) {
            cnt = max;
            formData.errors.plus = true;
          } else {
            cnt = Math.floor(cnt);
          }

          if (from === FROM_MANUAL) {
            resetErrors();
          }

          formData.cnt = cnt;
          setBuyCnt(cnt);
        }

        function bindFormData() {
          formData.cnt = 1;
          setBuyCnt(formData.cnt);
          options = angular.extend({}, defaultOptions, scope.options || {});

          formData.errors = {
            plus: false,
            minus: false
          };

          formData.messages = {
            minus: '至少购买' + options.min + '台',
            plus: '最多可购买' + options.max + '台'
          };

        }

        function init() {
          bindFormData();
        }

        vm.minus = function () {
          var cnt = formData.cnt;
          cnt--;
          validateCnt(cnt);
        };

        vm.plus = function () {
          var cnt = formData.cnt;
          cnt++;
          validateCnt(cnt);
        };

        vm.blur = function () {
          var cnt = formData.cnt;
          validateCnt(cnt, FROM_MANUAL);
        };

        vm.focus = function () {
          resetErrors();
        };

        init();

      }
    };
  }])
  .directive('payBuyCnt', ['Constants', '$timeout', function (Constants, $timeout) {
    'use strict';
    var FROM_MANUAL = 'manual',
      FROM_MODE_CHANGE = 'mode_change',
      payModes = Constants.payModes,
      validateLimit = Constants.validateLimit;

    return {
      restrict: 'A',
      transclude: true,
      scope: {
        limit: '=',
        setPayCnt: '='
      },
      link: function (scope, element, attrs, ctrl, transcludeFn) {
        var vm = scope,
          defaultLimit = { min: 1, max: 10 },
          globals = {
            limit: scope.limit || validateLimit || defaultLimit,
            unit: ''
          },
          formData = vm.formData = {
            payModes: payModes,
            errors: {
              plus: false,
              minus: false
            },
            messages: {
              plus: '',
              minus: ''
            }
          },
          setPayModeAndCnt = scope.setPayModeAndCnt || angular.noop,
          unit;

        function resetErrors() {
          formData.errors = {
            plus: false,
            minus: false
          };
        }

        function choiceUnit() {
          var unit,
            code = formData.payMode.code;

          switch (code) {
            case '0':
              unit = '年';
              break;
            case '1':
              unit = '月';
              break;
            case '2':
              unit = '小时';
              break;
            default:
              throw new Error('Now payMode only support 0, 1, 2');
              break;
          }
          globals.unit = unit;
        }

        function addChildElement() {
          transcludeFn(scope, function (clone, scope) {
            element.append(clone);
          });
        }

        function validateCnt(cnt, from) {
          var payMode = formData.payMode,
            code = payMode.code,
            unit = globals.unit,
            limit = globals.limit[code],
            min = limit.min,
            max = limit.max;

          resetErrors();
          if (cnt < min || from === FROM_MODE_CHANGE) {
            cnt = min;
            formData.errors.minus = true;
            formData.messages.minus = '至少购买' + min + unit;
          } else if (cnt > max) {
            cnt = max;
            formData.errors.plus = true;
            formData.messages.plus = '最多可购买' + max + unit;
          } else {
            cnt = Math.floor(cnt);
          }

          if (from === FROM_MANUAL || from == FROM_MODE_CHANGE) {
            resetErrors();
          }

          formData.payCnt = cnt;
          setPayModeAndCnt(payMode, cnt);
        }

        function bindFormData() {
          formData.payCnt = 1;
          formData.payMode = payModes[0];
          setPayModeAndCnt(formData.payMode, formData.payCnt);
          choiceUnit();
        }

        function init() {
          addChildElement();
          bindFormData();
        }

        vm.minus = function () {
          var cnt = formData.payCnt;
          cnt--;
          validateCnt(cnt);
        };

        vm.plus = function () {
          var cnt = formData.payCnt;
          cnt++;
          validateCnt(cnt);
        }

        vm.blur = function () {
          var cnt = formData.payCnt;
          validateCnt(cnt, FROM_MANUAL);
        };

        vm.focus = function () {
          resetErrors();
        };

        vm.$watch('formData.payMode', function (payMode) {
          if (payMode) {
            choiceUnit();
            validateCnt(formData.payCnt, FROM_MODE_CHANGE);
          }
        });

        init();
      }
    }
  }]);