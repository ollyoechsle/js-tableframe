(function () {

    module("JS Table Frame", {
        setup: function () {
            jQuery("body").append("<div class='tableContainer'></div><div class='pageControlsContainer'></div>");
        },
        teardown: function () {
            jQuery(".tableContainer").remove();
            model = null;
            table = null;
        }
    });

    test("Create Table", function () {
        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        when(model.setAllData(famousPeople()));

        thenThe(jQuery(".tableContainer table"))
            .should(haveClass("tf"));

        thenThe(jQuery(".tableContainer table thead"))
            .should(beThere)
            .should(haveText("Identifier", "Name", "Born", "Died", "Age"), inElement("th"))
            .should(haveAttribute("data-column", "id", "name", "born", "died", "age"), inElement("th"));

        thenThe(jQuery(".tableContainer table tbody"))
            .should(beThere)
            .should(haveText("1", "Michael Jackson", 1958, 2009, 51),
                inElement("tr:nth-child(1) td"))
            .should(haveText("2", "Albert Einstein", 1879, 1955, 76),
                inElement("tr:nth-child(2) td"))
            .should(haveText("3", "Abraham Lincoln", 1809, 1865, 56),
                inElement("tr:nth-child(3) td"))
            .should(haveText("4", "William Shakespeare", 1564, 1616, 52),
                inElement("tr:nth-child(4) td"));

    });

    test("Cell Classes", function () {
        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        when(model.setAllData(famousPeople()));

        thenThe(jQuery(".tableContainer table thead"))
            .should(haveClass("number", "string", "number", "number", "number"), inElement("th"));

        thenThe(jQuery(".tableContainer table tbody"))
            .should(haveClass("number", "string", "number", "number", "number"),
                inElement("tr:nth-child(1) td"))
            .should(haveClass("number", "string", "number", "number", "number"),
                inElement("tr:nth-child(2) td"));

    });

    test("Switch Data", function () {
        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        when(model.setAllData(famousPeople()));

        thenThe(jQuery(".tableContainer table"))
            .should(beThere)
            .should(haveText("Identifier", "Name", "Born", "Died", "Age"), inElement("tr th"));

        when(model.setAllData(fruits()));

        thenThe(jQuery(".tableContainer table"))
            .should(beThere)
            .should(haveText("Fruit", "Colour"), inElement("tr th"));

    });

    test("Destroy", function () {
        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        when(model.setAllData(famousPeople()));

        thenThe(jQuery(".tableContainer table"))
            .should(haveText("Identifier", "Name"), inElement("tr th"));

        when(table.destroy());
        when(model.setAllData(fruits()));

        thenThe(jQuery(".tableContainer table"))
            .should(haveText("Identifier", "Name"), inElement("tr th"));

    });

    test("Paging", function () {

        given(
            model = new js.TableModel(),
            table = new js.Table(".tableContainer", model),
            pageControls = new js.TablePageControls(".pageControlsContainer", model)
        );

        when(model.setAllData(jQuery.extend(famousPeople(), {
            pageSize: 2,
            pageNumber: 0
        })));

        console.log("HTML of page controls:");
        console.log(jQuery(".pageControlsContainer").html());

        thenThe(jQuery(".tableContainer table tbody"))
            .should(haveSize(2), inElement("tr"))
            .should(haveText(1, 2), inElement("td:first-child"));

        thenThe(jQuery(".pageControlsContainer ul"))
            .should(haveText("1", "2"), inElement("li"))
            .should(haveClass("current", ""), inElement("li"));

        when(theUserClicksOn("[data-page-number='1']"));

        thenThe(jQuery(".tableContainer table tbody"))
            .should(haveSize(2), inElement("tr"))
            .should(haveText(3, 4), inElement("td:first-child"));

    });

    test("Row Clicks", function () {

        given(
            model = new js.TableModel(),
            table = new js.Table(".tableContainer", model),
            table.on("rowClicked", clickHandler)
        );

        when(model.setAllData(fruits()));

        when(theUserClicksOn(".tableContainer tbody tr:nth-child(1)"));

        thenThe(clickHandler)
            .shouldHaveBeen(calledOnce)
            .shouldHaveBeen(calledWith("Apple"));

        when(theUserClicksOn(".tableContainer tbody tr:nth-child(2)"));

        thenThe(clickHandler)
            .shouldHaveBeen(calledAgain)
            .shouldHaveBeen(calledWith("Banana"));

    });

    test("Row Renderer", function () {
        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));
        given(table.withRowRenderer(function (jRow, rowData) {
            jRow.toggleClass("selected", rowData.id == "Apple")
        }));

        when(model.setAllData(fruits()));

        thenThe(jQuery(".tableContainer tbody"))
            .should(haveClass("selected"), inElement("tr[data-id='Apple']"));

    });

    test("Formatting", function () {

        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        when(model.setAllData(fruits()));

        when(model.setFormatter(
            "colour",
            function (colour) {
                return "<span class='icon' data-colour='" + colour + "'></span>"
            }
        ));

        when(table.draw());

        thenThe(jQuery(".tableContainer tbody tr"))
            .should(haveText("Apple", "Banana", "Orange", "Red Grape"), inElement("td:first-child"))
            .should(haveAttribute("data-colour", "green", "yellow", "orange", "purple"),
                inElement(".icon"));

    });

    test("Sorting", function () {

        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        when(model.setAllData(famousPeople()));

        thenThe(jQuery(".tableContainer tbody tr"))
            .should(haveText("Michael Jackson", "Albert Einstein", "Abraham Lincoln",
                "William Shakespeare"), inElement("td:nth-child(2)"));

        when(theUserClicksOn(".tableContainer thead [data-column='name']"));

        thenThe(jQuery(".tableContainer tbody tr"))
            .should(haveText("Abraham Lincoln", "Albert Einstein", "Michael Jackson",
                "William Shakespeare"), inElement("td:nth-child(2)"));

        thenThe(jQuery(".tableContainer thead [data-column='name']"))
            .should(haveAttribute("data-sort", "ascending"))

    });

    test("Sorting in Config", function () {

        given(model = new js.TableModel(), table = new js.Table(".tableContainer", model));

        var data = famousPeople();
        data.sortDirection = js.TableModel.ASCENDING;
        data.sortField = "age";

        when(model.setAllData(data));

        thenThe(jQuery(".tableContainer tbody tr"))
            .should(haveText("51",
                "52",
                "56",
                "76"), inElement("td:nth-child(5)"));

        thenThe(jQuery(".tableContainer thead [data-column='age']"))
            .should(haveAttribute("data-sort", "ascending"))

    });

    test("Get Column", function () {

        var model = new js.TableModel(
            fruits()
        );

        ok(model.getColumn("id"));
        ok(model.getColumn("colour"));
        ok(!model.getColumn("foo"))

    });

    /* End of Tests */

    var model, table, clickHandler = sinon.stub();

    function famousPeople() {
        return {
            columns: [
                {
                    id: "id",
                    name: "Identifier",
                    data: {className: "number"}
                },
                {
                    id: "name",
                    name: function () {
                        return "Name";
                    },
                    data: {className: "string"}
                },
                {
                    id: "born",
                    name: "Born",
                    data: {className: "number"}
                },
                {
                    id: "died",
                    name: "Died",
                    data: {className: "number"}
                },
                {
                    id: "age",
                    name: "Age",
                    data: {className: "number"},
                    valueFn: function (person) {
                        return person.died - person.born;
                    }
                }
            ],
            data: [
                {"id": "1", "name": "Michael Jackson", "born": 1958, "died": 2009},
                {"id": "2", "name": "Albert Einstein", "born": 1879, "died": 1955},
                {"id": "3", "name": "Abraham Lincoln", "born": 1809, "died": 1865},
                {"id": "4", "name": "William Shakespeare", "born": 1564, "died": 1616}
            ]
        }
    }

    function fruits() {
        return {
            columns: [
                {
                    id: "id",
                    name: "Fruit"
                },
                {
                    id: "colour",
                    name: "Colour"
                }
            ],
            data: [
                {"id": "Apple", colour: "green"},
                {"id": "Banana", colour: "yellow"},
                {"id": "Orange", colour: "orange"},
                {"id": "Red Grape", colour: "purple"}
            ]
        }
    }

})();