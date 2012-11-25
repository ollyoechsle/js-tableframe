(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.initialise();
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;

    Table.prototype.initialise = function() {
        this.model.on("allDataChanged", this.draw, this);
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

    Table.prototype.destroy = function() {
        this.model.un(null, this);
    }

    function renderDataRow(row) {
        return Mustache.to_html(Table.ROW, {list:row.map(valueObject)});
    }

    function valueObject(item) {
        return {value:item}
    }

    Table.TH = '<th data-column="{{{id}}}">{{{name}}}</th>';
    Table.TABLE = '<table><thead><tr></tr></tr></thead><tbody></tbody></table>';
    Table.ROW = '<tr>{{#list}}<td>{{{value}}}</td>{{/list}}</tr>';

    js.Table = Table;

})();