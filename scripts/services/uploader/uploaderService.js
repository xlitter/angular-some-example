angular.module('app').factory('UploaderService', function(FileUploader, AlertService) {
  'use strict';

  function Uploader(url, options) {
    var defaultOptions = {
		alias: 'file',
        autoUpload: true
      },
      options = this.options = angular.extend(defaultOptions, options);
    
    this.uploader = new FileUploader({
      url: url,
	  alias: options.alias,
      autoUpload: options.autoUpload
    });
  }

  Uploader.prototype = {
    constructor: Uploader,
    init: function() {
      _init();
    },
    //@param {Object} filter
    addFilter: function(filter) {
      var that = this;
      that.uploader.filters.push(filter);
    },
    addFilters: function(filters) {
      var that = this;
      if (Array.isArray(filters)) {
        filters.forEach(function(v) {
          that.uploader.filters.push(v);
        });
      }
    },
    addWhenAddingFileFailed: function(handler) {
      var that = this;
      that.uploader.onWhenAddingFileFailed = function(fileItem, filter) {
        handler.apply(null, arguments);
      };
    },
    addCompleteHanler: function(handler) {
      var that = this;
      that.uploader.onCompleteItem = function() {
        handler.apply(null, arguments);
      };
    },
    _init: function() {
      var that = this;
      that._onWhenAddingFileFailed();
      that._onCompleteItem();
    },
    _onWhenAddingFileFailed: function() {
      var that = this;
      that.uploader.onWhenAddingFileFailed = function(item, filter) {
        AlertService.alert({
          title: '提示信息',
          content: filter.msg
        });
      };
    },
    _onCompleteItem: function() {
      var that = this;
      that.uploader.onCompleteItem = angular.noop;
    }
  }

  return {
    Uploader: Uploader
  };
});
