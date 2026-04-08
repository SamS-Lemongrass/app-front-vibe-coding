sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    function enrichTask(t) {
        t.statusIcon = t.done ? "sap-icon://accept" : "sap-icon://circle-task-2";
        t.priorityState = t.priority === "High" ? "Error" : (t.priority === "Medium" ? "Warning" : "Success");
        return t;
    }

    return Controller.extend("appfront.mta.demo.controller.App", {
        onInit: function () {
            var aTasks = [
                { title: "Review Q2 budget proposal", done: false, category: "Work", priority: "High" },
                { title: "Book team offsite venue", done: false, category: "Work", priority: "Medium" },
                { title: "Update project documentation", done: true, category: "Work", priority: "Low" },
                { title: "Grocery shopping", done: false, category: "Shopping", priority: "Medium" },
                { title: "Schedule dentist appointment", done: false, category: "Health", priority: "Low" },
                { title: "Complete SAP BTP tutorial", done: true, category: "Learning", priority: "High" }
            ].map(enrichTask);

            this.getView().setModel(new JSONModel({ tasks: aTasks }));
        },

        onAddTask: function () {
            var oInput = this.byId("newTaskInput");
            var sTitle = oInput.getValue().trim();
            if (!sTitle) { return; }

            var cats = ["Work", "Personal", "Shopping", "Health", "Learning"];
            var pris = ["High", "Medium", "Low"];
            var oModel = this.getView().getModel();
            var aTasks = oModel.getProperty("/tasks");
            aTasks.unshift(enrichTask({
                title: sTitle,
                done: false,
                category: cats[Math.floor(Math.random() * cats.length)],
                priority: pris[Math.floor(Math.random() * pris.length)]
            }));
            oModel.setProperty("/tasks", aTasks);
            oInput.setValue("");
        },

        onToggleTask: function (oEvent) {
            var oModel = this.getView().getModel();
            var sPath = oEvent.getSource().getBindingContext().getPath();
            var oTask = oModel.getProperty(sPath);
            oTask.done = !oTask.done;
            enrichTask(oTask);
            oModel.setProperty(sPath, oTask);
        },

        onClearCompleted: function () {
            var oModel = this.getView().getModel();
            var aTasks = oModel.getProperty("/tasks").filter(function (t) { return !t.done; });
            oModel.setProperty("/tasks", aTasks);
        },

        onFilterAll: function () { this._applyFilter(); },
        onFilterOpen: function () { this._applyFilter(false); },
        onFilterDone: function () { this._applyFilter(true); },

        _applyFilter: function (bDone) {
            var oList = this.byId("taskList");
            var aFilters = bDone !== undefined ? [new Filter("done", FilterOperator.EQ, bDone)] : [];
            oList.getBinding("items").filter(aFilters);
        }
    });
});
