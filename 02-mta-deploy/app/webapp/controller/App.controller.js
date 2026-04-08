sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    var CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Learning"];
    var PRIORITIES = ["High", "Medium", "Low"];

    return Controller.extend("appfront.mta.demo.controller.App", {
        onInit: function () {
            var oData = {
                tasks: [
                    { title: "Review Q2 budget proposal", done: false, category: "Work", priority: "High" },
                    { title: "Book team offsite venue", done: false, category: "Work", priority: "Medium" },
                    { title: "Update project documentation", done: true, category: "Work", priority: "Low" },
                    { title: "Grocery shopping", done: false, category: "Shopping", priority: "Medium" },
                    { title: "Schedule dentist appointment", done: false, category: "Health", priority: "Low" },
                    { title: "Complete SAP BTP tutorial", done: true, category: "Learning", priority: "High" }
                ],
                openCount: 0,
                doneCount: 0
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            this._updateCounts();
        },

        onAddTask: function () {
            var oInput = this.byId("newTaskInput");
            var sTitle = oInput.getValue().trim();
            if (!sTitle) { return; }

            var oModel = this.getView().getModel();
            var aTasks = oModel.getProperty("/tasks");
            aTasks.unshift({
                title: sTitle,
                done: false,
                category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)]
            });
            oModel.setProperty("/tasks", aTasks);
            oInput.setValue("");
            this._updateCounts();
            this._applyFilter(this.byId("iconTabBar").getSelectedKey());
        },

        onToggleTask: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            var sPath = oCtx.getPath() + "/done";
            var oModel = this.getView().getModel();
            oModel.setProperty(sPath, !oModel.getProperty(sPath));
            this._updateCounts();
        },

        onDeleteTask: function (oEvent) {
            oEvent.getSource().getParent().getParent(); // prevent toggle
            var oCtx = oEvent.getSource().getBindingContext();
            var iIndex = parseInt(oCtx.getPath().split("/").pop(), 10);
            var oModel = this.getView().getModel();
            var aTasks = oModel.getProperty("/tasks");
            aTasks.splice(iIndex, 1);
            oModel.setProperty("/tasks", aTasks);
            this._updateCounts();
        },

        onClearCompleted: function () {
            var oModel = this.getView().getModel();
            var aTasks = oModel.getProperty("/tasks").filter(function (t) { return !t.done; });
            oModel.setProperty("/tasks", aTasks);
            this._updateCounts();
            this._applyFilter(this.byId("iconTabBar").getSelectedKey());
        },

        onFilterSelect: function (oEvent) {
            this._applyFilter(oEvent.getParameter("key"));
        },

        _applyFilter: function (sKey) {
            var oList = this.byId("taskList");
            var aFilters = [];
            if (sKey === "open") {
                aFilters.push(new Filter("done", FilterOperator.EQ, false));
            } else if (sKey === "done") {
                aFilters.push(new Filter("done", FilterOperator.EQ, true));
            }
            oList.getBinding("items").filter(aFilters);
        },

        _updateCounts: function () {
            var oModel = this.getView().getModel();
            var aTasks = oModel.getProperty("/tasks");
            var iDone = aTasks.filter(function (t) { return t.done; }).length;
            oModel.setProperty("/openCount", aTasks.length - iDone);
            oModel.setProperty("/doneCount", iDone);
        }
    });
});
