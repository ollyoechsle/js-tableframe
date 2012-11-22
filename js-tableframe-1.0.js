/* JS Table Frame 1.0 */

/**@namespace*/
window.OO = window.OO || {};
(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;

    Table.prototype.draw = function () {
        var jTable = jQuery(Mustache.to_html(Table.TABLE)),
            jTbody = jTable.find("tbody");

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

    function renderDataRow(row) {
        return Mustache.to_html(Table.ROW, {list:row.map(valueObject)});
    }

    function valueObject(item) {
        return {
            value:item
        }
    }

    Table.TH = '<th data-id="{{{id}}}">{{{name}}}</th>';
    Table.TABLE = '<table><thead><tr></tr></tr></thead><tbody></tbody></table>';
    Table.ROW = '<tr>{{#list}}<td>{{value}}</td>{{/list}}</tr>';

    OO.Table = Table;

})();
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