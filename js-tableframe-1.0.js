/* JS Table Frame 1.0 */

/**@namespace*/
window.js = window.js || {};

(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.cellRenderers = [Table.ADD_COLUMN_CLASS];
        this.initialise();
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;
    Table.prototype.cellRenderers = null;

    Table.prototype.withCellRenderer = function (rendererFn) {
        this.cellRenderers.push(rendererFn);
        return this;
    };

    Table.prototype.initialise = function () {
        this.model.on("allDataChanged", this.draw, this);
        this.jContainer.delegate("tbody tr", "click.table", this.handleRowClick.bind(this));
    };

    Table.prototype.draw = function () {
        var jTable = jQuery(Table.TABLE),
            rows = this.model.getVisibleRows(),
            columns = this.model.getColumns(),
            jHeaderRow = jTable.find("thead tr"),
            jTbody = jTable.find("tbody"),
            column,
            i, l;

        for (i = 0, l = columns.length; i < l; i++) {
            column = columns[i];
            this.renderCell(
                jQuery("<th></th>")
                    .attr("data-column", column.id)
                    .html(column.name)
                    .appendTo(jHeaderRow),
                column,
                i,
                this.model
            )
        }

        for (i = 0, l = rows.length; i < l; i++) {
            jTbody.append(this.renderDataRow(rows[i], columns))
        }

        this.jContainer
            .empty()
            .append(jTable);

    };

    Table.prototype.handleRowClick = function (jEvent) {
        var jRow = jQuery(jEvent.currentTarget),
            id = jRow.data("id");
        this.fire("rowClicked", id);
    };

    Table.prototype.destroy = function () {
        this.model.un(null, this);
        this.jContainer.undelegate(".table");
    };

    Table.prototype.renderDataRow = function (row, columns) {

        var jRow = jQuery("<tr></tr>").attr("data-id", row.id),
            rowLength = row.length,
            i;

        for (i = 0; i < rowLength; i++) {

            this.renderCell(
                jQuery("<td></td>")
                    .html(row[i])
                    .appendTo(jRow),
                columns[i],
                i,
                this.model,
                row
            );

        }

        return jRow;

    };

    Table.prototype.renderCell = function (jCell, column, index, model, row) {
        this.cellRenderers.forEach(function (fn) {
            fn(jCell, column, index, model, row);
        })
    };

    Table.ADD_COLUMN_CLASS = function (jCell, column, index, model, row) {
        jCell.addClass(column.className);
    };

    Table.TABLE = '<table><thead><tr></tr></tr></thead><tbody></tbody></table>';

    js.Table = Table;

})();
(function () {

    function TableModel(options) {
        this.setAllData(options || {});
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;
    TableModel.prototype.allData = null;
    TableModel.prototype.pageSize = null;
    TableModel.prototype.pageNumber = null;

    TableModel.prototype.setAllData = function (options) {
        this.columns = options.columns || [];
        this.allData = options.data || [];
        this.pageSize = options.pageSize || 10;
        this.pageNumber = options.pageNumber || 0;
        this.fire("allDataChanged");
    };

    TableModel.prototype.setPage = function (num) {
        this.pageNumber = num || 0;
        this.fire("allDataChanged");
    };

    TableModel.prototype.setFormatter = function (columnId, formatterFn) {
        var column = this.getColumn(columnId);
        column && (column.formatter = formatterFn);
        return this;
    };

    TableModel.prototype.getColumn = function (columnId) {
        return this.columns.filter(function (column) {
            return column.id == columnId;
        })[0];
    };

    TableModel.prototype.getColumns = function () {
        return this.columns;
    };

    TableModel.prototype.getVisibleRows = function () {
        return this.allData
            .filter(this.inPage.bind(this))
            .map(this.transformRow.bind(this));
    };

    TableModel.prototype.transformRow = function (row) {

        var formatted = [];

        this.columns.forEach(function (column) {
            var formatter = column.formatter || TableModel.NO_FORMAT,
                value = formatter(row[column.id], row);
            value.className = column.className;
            formatted.push(value);
        });

        formatted.id = row.id;

        return formatted;

    };

    TableModel.prototype.inPage = function (value, index, array) {
        var min = this.pageNumber * this.pageSize;
        return index >= min && index < min + this.pageSize;
    };

    TableModel.NO_FORMAT = function (val) {
        return val;
    };

    js.TableModel = TableModel;

})();