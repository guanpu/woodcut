/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * The Device Binding ViewModel
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'utils/notifier', 'ojs/ojknockout', 'promise',
    'ojs/ojtable', 'ojs/ojgauge', 'ojs/ojdialog', 'ojs/ojcollectiontabledatasource', 'ojs/ojradioset',
    'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojinputnumber', 'ojs/ojdatetimepicker',
    'ojs/ojswitch', 'ojs/ojinputtext', 'ojs/ojselectcombobox', 'jet-composites/q-control/loader',
    'ojs/ojarraydataprovider', 'ojs/ojcollapsible'
  ],
  function(oj, ko, $, notifier) {

    function DeviceBindingViewModel() {
      var self = this;
        self.field$gender = ko.observable();
        self.field$age = ko.observable();

      self.serviceURL = "slctenant";

      self.enable_delete = ko.observable(true);

      self.title = ko.observable("slctennat");

      self.queryButtonText = ko.observable("query");
      self.queryFields = [
        {
          name: "gender",
          type: "String",
          label: "Gender"
        },
        {
          name: "age",
          type: "Number",
          label: "Age"
        },
      ];

      self._createentity = {
        "gender":self.field$gender,
        "age":self.field$age,
      }

      self._pageSize = ko.observable(10);
      
      self.columnArray = ko.observableArray([
        {
          "headerText": "Gender",
          "field": "gender"  
        },
        {
          "headerText": "Age",
          "field": "age"  
        },
      ]);

      self._initcreate = function() {
        self.field-gender(undefined);
        self.field-age(undefined);
      }

      self._viewdata = function(response) {
        return {
            gender: response.gender,
            age: response.age,
        };
      };

      self.openCreateDialog = function() {
        $("#createModalDialog").get(0).open();
      };



      function getURL(operation, collection, options) {
        var url = self.serviceURL;
        if (options.fetchSize !== undefined) {
          url += "?limit=" + options.fetchSize;
        }
        if (options.startIndex !== undefined) {
          url += "&offset=" + options.startIndex;
        }
        var q = document.getElementById("queryParameter").getQueryString();
        if (q !== undefined && q !== "") {
          let z = encodeURI(q);
          url += ("&" + z);
        }
        return url;
      };

      self.Views = oj.Model.extend({
        urlRoot: self.serviceURL,
        parse: self._viewdata,
        idAttribute: 'imsi'
      });

      self.ViewCollection = oj.Collection.extend({
        customURL: getURL,
        model: new self.Views(),
        fetchSize: 10
      });

      self.ViewCol = ko.observable();

      self.ViewCol(new self.ViewCollection());


      /**
       * Do filtered query;
       */
      self.filteredQuery = function() {
        self.ViewCol().refresh();
      }

      datasource = new oj.CollectionTableDataSource(self.ViewCol(), {
        startFetch: "disabled"
      });

      self.pagingDatasource = ko.observable(new oj.PagingTableDataSource(datasource));

      self.deleteOpen = function() {
        $("#delete_dialog").get(0).open();
      };

      self.cancelDelete = function() {
        $("#delete_dialog").get(0).close();
      };

      //create imsi
      self.createOne = function() {
        let url = self.serviceURL;
        $.ajax(url, {
          data: JSON.stringify(self._createentity),
          method: 'POST',
          processData: false,
          contentType: "application/json",
          success: function(res) {
            document.querySelector('#createModalDialog').close();
            self._initcreate();
            self.ViewCol().refresh();
          }
        });
      };

      self.getId = function() {
        return "TODO";
      };

      self.deleteOne = function() {
        let url = self.serviceURL;
        let deleteurl = url + "/" + self.getId();
        $.ajax(deleteurl, {
          method: 'DELETE',
          processData: false,
          contentType: "application/json",
          success: function(res) {
            self.cancelDelete();
            self.ViewCol().refresh();
          }
        });
      }
    }

    return new DeviceBindingViewModel();
  }
);
