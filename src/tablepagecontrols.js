(function () {

    function TablePageControls(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.initialise();
    }

    TablePageControls.prototype = Object.create(Subscribable.prototype);

    TablePageControls.prototype.jContainer = null;

    TablePageControls.prototype.initialise = function () {
        this.model.on("allDataChanged", this.draw, this);
        this.jContainer.delegate("[data-page-number]", "click.TablePageControls", this.handlePageClicked.bind(this));
    };

    TablePageControls.prototype.draw = function () {

        var jPageList = jQuery("<ul class='tf page-controls'></ul>"),
            currentPageNumber = this.model.pageNumber,
            pageNumber,
            pageCount = this.model.getPageCount();

        if (pageCount > 1) {
            for (pageNumber = 0; pageNumber < pageCount; pageNumber++) {

                jQuery("<li></li>")
                    .text(pageNumber + 1)
                    .toggleClass("current", currentPageNumber == pageNumber)
                    .attr("data-page-number", pageNumber)
                    .appendTo(jPageList)

            }
        }

        this.jContainer.empty().append(jPageList);

    };

    TablePageControls.prototype.handlePageClicked = function (jEvent) {
        var jRow = jQuery(jEvent.currentTarget),
            pageNumber = jRow.data("pageNumber");
        this.model.setPage(pageNumber);
    };

    TablePageControls.prototype.destroy = function () {
        this.model.un(null, this);
        this.jContainer.undelegate(".TablePageControls");
    };

    TablePageControls.TablePageControls = '<ul class="tf TablePageControls"></ul>';

    js.TablePageControls = TablePageControls;

})();