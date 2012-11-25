/* JS Table Frame 1.0 */

/**@namespace*/
window.js = window.js || {};

(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.initialise();
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;

    Table.prototype.initialise = function () {
        this.model.on("allDataChanged", this.draw, this);
        this.jContainer.delegate("tbody tr", "click.table", this.handleRowClick.bind(this));
    };

    Table.prototype.draw = function () {
        var jTable = jQuery(Mustache.to_html(Table.TABLE));

        jTable.find("thead tr").html(
            this.model.getColumns()
                .map(Mustache.to_html.bind(this, Table.TH))
                .join("")
        );

        jTable.find("tbody").html(
            this.model.getVisibleRows()
                .map(renderDataRow)
                .join("")
        );

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

    function renderDataRow(row) {
        return Mustache.to_html(Table.ROW, {
                                    className:row.className,
                                    id:row.id,
                                    list:row.map(valueObject)}
        );
    }

    function valueObject(item) {
        return {value:item}
    }

    Table.TH = '<th class="{{className}}" data-column="{{{id}}}">{{{name}}}</th>';
    Table.TABLE = '<table><thead><tr></tr></tr></thead><tbody></tbody></table>';
    Table.ROW = '<tr class="{{className}}" data-id="{{id}}">{{#list}}<td>{{{value}}}</td>{{/list}}</tr>';

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