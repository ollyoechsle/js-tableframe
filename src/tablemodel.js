(function () {

    function TableModel(options) {
        this.columns = options.columns || [];
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;

    TableModel.prototype.getColumns = function() {
        return this.columns;
    };

    OO.TableModel = TableModel;

})();