angular.module('app').directive('piePercent', function () {

  return {
    restrict: 'A',
    scope: {
      percent: '@',
      progress: '&'
    },
    link: function (scope, element, attrs) {
      var value = Math.floor(Number(attrs['piePercent'])),
        deg = value % 360,
        value = value / 360 !== 0 && deg === 0 ? 360 : deg,
        before = element.find('.pie-left'),
        after = element.find('.pie-right'),
        i, setBeforeFlag = false;
      console.log('percent', attrs['piePercent']);
      console.log(value, before, after)

      if (value) {
        element.animate({
          c: value
        }, {
            duration: 500,
            step: function (now, fx) {
              console.log('now', now);
              if (now <= 180) {
                before.css({
                  'webkitTransform': 'rotate(' + (now) + 'deg)',
                  'transform': 'rotate(' + (now) + 'deg)'
                });
              } else {
                after.css({
                  // 'webkitTransform': 'rotate(' + (now - 180) + 'deg)',
                  transform: 'rotate(' + (now - 180) + 'deg)',
                  'zIndex': '10'
                });
                setBeforeFlag = true;
              }
              
              //防止小数不为180deg
              if (setBeforeFlag) {
                before.css('transform', 'rotate(180deg)');
                setBeforeFlag = false;
              }
            },
            done: function () {
              console.log('done');
            },
            complete: function () {
              console.log('complete');
            }
          })
      }

    }
  }
});