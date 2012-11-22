(function () {

    function TableModel(options) {
        this.columns = options.columns || [];
        this.allData = options.data || [];
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;
    TableModel.prototype.allData = null;

    TableModel.prototype.getColumns = function () {
        return this.columns;
    };

    TableModel.prototype.getVisibleRows = function () {
        return this.allData;
    };

    OO.TableModel = TableModel;

})();