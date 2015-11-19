angular.module('app').controller('ImageUpload2Ctrl', function($scope, FileUploader, UploaderService, AlertService) {
  'use strict';

  var vm = $scope,
    fileUploadUrl = '/uploderurl',
    fileUplaod2Url = '/waterUploadUrl',
    globals = {
      uploads: {
        imgUpload: {},
        waterUpload: {}
      },
      filters: {
        //typs : |jpg|png|jpeg|
        imgTypeFilter: function(types) {
          types = types || '|jpg|png|jpeg|';

          return {
            name: 'imageFilter',
            msg: '上传附件仅支持jpg/jpeg/png格式',
            fn: function(item) {
              console.log('file item', item);
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return types.indexOf(type) !== -1;
            }
          };
        },
        limitFilter: function(limit, uploadItems) {
          return {
            name: 'limitFilter',
            msg: '最多上传' + limit + '个附件',
            fn: function(fileLikeObject, fileItem) {
              var items,
              idx = fileItem.idx;
              
              if(angular.isNumber(idx)&&!angular.isUndefined(uploadItems[idx])){
                uploadItems[idx] = undefined;
              }
              
              items = uploadItems.filter(function(v) {
                return typeof v !== 'undefined';
              });
              return items.length < limit;
            }
          };
        }

      }

    },
    formData = vm.formData = {
      imgCnt: [{
        name: 1
      }, {
        name: 2
      }, {
        name: 3
      }],
      waterList: [{
        name: 'a'
      }, {
        name: 'b'
      }]
    };

  /*
    @param {Array} 待显示元素items
    @param {Array<Object>} filters 过滤器列表
    @param {Object} options
           {Boolean} autoUpload,
           {Function} onWhenAddingFileFailed
           {Function} onCompleteItem
           
  */
  function createFileUpload(url, filters, options) {
    var uploader;

    filters = filters || [];

    uploader = new UploaderService.Uploader(url, options);

    uploader.addFilters(filters);

    if (typeof options.onWhenAddingFileFailed === 'function') {
      uploader.addWhenAddingFileFailed(options.onWhenAddingFileFailed);
    }
    if (typeof options.onCompleteItem === 'function') {
      uploader.addCompleteHanler(options.onCompleteItem);
    }

    return uploader.uploader;
  }

  function createUploadHanler(url, items, completeCallback, options) {
    var fileUploader,
      limit,
      uploadItems,
      filters = [],
      globalsFilter = globals.filters;

	options = options ||{};
	  
    if ((items || []).length === 0) {
      throw new Error('待显示元素length为0');
    }

    limit = items.length;
    uploadItems = new Array(limit);

    filters.push(globalsFilter.imgTypeFilter());

    filters.push(globalsFilter.limitFilter(limit, uploadItems));

    options.onCompleteItem = function() {
      var args = [].slice.call(arguments);
      args.unshift(uploadItems);
      completeCallback.apply(null, args);
    }

    fileUploader = createFileUpload(url, filters, options);

    return {
      fileUploader: fileUploader,
      uploadItems: uploadItems
    };
  }

  function createImgUpload() {

    var imgUpload = globals.uploads.imgUpload = createUploadHanler(fileUploadUrl, formData.imgCnt, function(uploadItems, fileItem, rsp) {
      var errCode = rsp.errCode,
        data = rsp.data,
        idx = fileItem.idx,
        errMsg = rsp.errMsg || '内部错误';

      uploadItems[idx] = {
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
    },{alias: 'prd_img'});

    formData.imgUploader = imgUpload.fileUploader;
    formData.imgUploadItems = imgUpload.uploadItems;
  }

  function createWaterUpload() {
    var waterUpload =
      globals.uploads.waterUpload = createUploadHanler(fileUplaod2Url, formData.waterList, function(uploadItems, fileItem, rsp) {
        var errCode = rsp.errCode,
          data = rsp.data,
          idx = fileItem.idx,
          errMsg = rsp.errMsg || '内部错误';

        uploadItems[idx] = {
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
      }, {alias: 'prd_img'});

    formData.waterUploader = waterUpload.fileUploader;
    formData.waterUploadItems = waterUpload.uploadItems;

  }

  function clearInputVal(idx, uploader) {
    uploader._directives.select[idx].element.val('');
  }

  function init() {
    createImgUpload();
    createWaterUpload();
  }

  vm.removeUpload = function(idx, type) {
    var fileItems,
      uploader = globals.uploads[type],
      fileUploader = uploader.fileUploader;

    if (!uploader) {
      return;
    }
    fileItems = uploader.uploadItems;

    if (idx < 0 || idx >= fileItems.length) {
      return;
    }
    clearInputVal(idx, fileUploader);
    fileUploader.removeFromQueue(fileItems[idx].fileItem);

    fileItems[idx] = undefined;
  };

  vm.moveToLeft = function(idx, type) {
    var fileItems,
      uploader = globals.uploads[type],
      fileUploader = uploader.fileUploader;

    if (!uploader) {
      return;
    }
    fileItems = uploader.uploadItems;

    if (idx <= 0) {
      return;
    }

    if (fileItems[idx - 1] !== undefined) {
      return;
    }
    clearInputVal(idx, fileUploader);
    fileItems[idx - 1] = fileItems[idx];
    fileItems[idx] = undefined;
  };

  vm.moveToRight = function(idx, type) {
    var fileItems,
      uploader = globals.uploads[type],
      fileUploader = uploader.fileUploader;

    if (!uploader) {
      return;
    }

    fileItems = uploader.uploadItems;

    if (idx >= fileItems.length - 1) {
      return;
    }
    clearInputVal(idx, fileUploader);
    if (fileItems[idx + 1] !== undefined) {
      return;
    }

    fileItems[idx + 1] = fileItems[idx];
    fileItems[idx] = undefined;
  };

  init();
  return vm;

});
