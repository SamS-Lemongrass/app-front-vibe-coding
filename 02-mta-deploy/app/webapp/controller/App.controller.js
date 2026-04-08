sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    // #region agent log
    var _dbg = [];
    function dbg(msg, data) {
        _dbg.push(msg + ": " + JSON.stringify(data));
        var el = document.getElementById("__debugPanel");
        if (el) { el.textContent = _dbg.join("\n"); }
    }
    window.__dbg = dbg;
    // #endregion

    function enrichTask(t) {
        t.statusIcon = t.done ? "sap-icon://accept" : "sap-icon://circle-task-2";
        t.priorityState = t.priority === "High" ? "Error" : (t.priority === "Medium" ? "Warning" : "Success");
        return t;
    }

    return Controller.extend("appfront.mta.demo.controller.App", {
        onInit: function () {
            // #region agent log
            dbg("H5:onInit", "fired");
            // #endregion

            var aTasks = [
                { title: "Review Q2 budget proposal", done: false, category: "Work", priority: "High" },
                { title: "Book team offsite venue", done: false, category: "Work", priority: "Medium" },
                { title: "Update project documentation", done: true, category: "Work", priority: "Low" },
                { title: "Grocery shopping", done: false, category: "Shopping", priority: "Medium" },
                { title: "Schedule dentist appointment", done: false, category: "Health", priority: "Low" },
                { title: "Complete SAP BTP tutorial", done: true, category: "Learning", priority: "High" }
            ].map(enrichTask);

            var oModel = new JSONModel({ tasks: aTasks });
            this.getView().setModel(oModel);

            // #region agent log
            dbg("H3:modelSet", { taskCount: aTasks.length, firstTitle: aTasks[0].title });
            // #endregion

            var that = this;
            setTimeout(function () {
                // #region agent log
                var el = document.createElement("pre");
                el.id = "__debugPanel";
                el.style.cssText = "position:fixed;bottom:0;left:0;right:0;background:#111;color:#0f0;padding:10px;font-size:12px;z-index:99999;max-height:40vh;overflow:auto;";
                document.body.appendChild(el);
                // #endregion

                var oList = that.byId("taskList");
                var oBinding = oList ? oList.getBinding("items") : null;
                var aItems = oList ? oList.getItems() : [];
                var oDom = oList ? oList.getDomRef() : null;

                // #region agent log
                dbg("H1:listState", {
                    listExists: !!oList,
                    bindingExists: !!oBinding,
                    bindingLength: oBinding ? oBinding.getLength() : null,
                    renderedItemCount: aItems.length,
                    firstItemText: aItems.length > 0 ? aItems[0].getTitle() : null,
                    listDomExists: !!oDom,
                    listHeight: oDom ? oDom.offsetHeight : null,
                    listParentClass: oDom && oDom.parentElement ? oDom.parentElement.className : null,
                    listParentHeight: oDom && oDom.parentElement ? oDom.parentElement.offsetHeight : null
                });
                // #endregion

                // #region agent log
                if (oDom) {
                    dbg("H2:listHTML", oDom.innerHTML.substring(0, 800));
                }
                // #endregion

                // #region agent log
                el.textContent = _dbg.join("\n");
                // #endregion
            }, 3000);
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
