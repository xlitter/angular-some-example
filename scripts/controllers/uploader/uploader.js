angular.module('app').controller('ImageUploadCtrl', function($scope, FileUploader, AlertService) {
  'use strict';

  var vm = $scope,
    fileUploadUrl = '/uploderurl',
    globals = {
      maxUploadNum: 5,
      uploader: new FileUploader({
        url: fileUploadUrl,
        autoUpload: true

      })
    },
    formData = vm.formData = {
      imgCnt: [1, 2, 3, 4, 5],
      uploader: globals.uploader,
      fileItems: new Array(globals.maxUploadNum)
    };

  function upload() {
    var uploader = globals.uploader,
      maxUploadNum = globals.maxUploadNum;

    uploader.filters.push({
      name: 'imageFilter',
      msg: '上传附件仅支持jpg/jpeg/png格式',
      fn: function(item) {
        console.log('file item', item);
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|'.indexOf(type) !== -1;
      }
    });

    uploader.filters.push({
      name: 'maxUploadNumFilter',
      msg: '最多上传' + maxUploadNum + '个附件',
      fn: function() {
        var fileItems = formData.fileItems.filter(function(v) {
          return typeof v !== 'undefined';
        });
        return fileItems.length < maxUploadNum;
      }
    });

    uploader.onWhenAddingFileFailed = function(item, filter) {
      AlertService.alert({
        title: '提示信息',
        content: filter.msg
      });
    };

    uploader.onCompleteItem = function(fileItem, response) {
      var errCode = response.errCode,
        data = response.data,
        idx = fileItem.idx,
        errMsg = response.errMsg || '内部错误';

      formData.fileItems[idx] = {
        fileItem: fileItem,
        src: './images/imageupload/Koala.jpg'
      };

      /*switch (errCode) {
        case '0':
          formData.fileItems.push({
            fileItem: fileItem,
            url: data.imgPath
          });
          break;
        default:
          AlertService.alert({
            title: '提示信息',
            content: errMsg
          });
          break;
      }*/
    };

  }

  function clearInputVal(idx) {
    globals.uploader._directives.select[idx].element.val('');
  }

  function init() {
    upload();
  }

  vm.removeUpload = function(idx) {
    var fileItems = formData.fileItems;
    if (idx < 0 || idx >= fileItems.length) {
      return;
    }
    clearInputVal(idx);
    globals.uploader.removeFromQueue(fileItems[idx].fileItem);
    fileItems[idx] = undefined;
  };

  vm.moveToLeft = function(idx) {
    var fileItems = formData.fileItems;
    if (idx <= 0) {
      return;
    }

    if (fileItems[idx - 1] !== undefined) {
      return;
    }

    fileItems[idx - 1] = fileItems[idx];
    fileItems[idx] = undefined;
  };

  vm.moveToRight = function(idx) {
    var fileItems = formData.fileItems;
    if (idx >= fileItems.length - 1) {
      return;
    }

    if (fileItems[idx + 1] !== undefined) {
      return;
    }

    fileItems[idx + 1] = fileItems[idx];
    fileItems[idx] = undefined;
  };

  init();
  return vm;

});
