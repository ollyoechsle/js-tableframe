(function () {

    module("JS Table Frame", {
        setup:function () {
            jQuery("body").append("<div class='tableContainer'></div>");
        },
        teardown:function () {
            jQuery(".tableContainer").remove();
        }
    });

    test("Create Table", function () {
        var model = new OO.TableModel(famousPeople());

        var table = new OO.Table(".tableContainer", model);

        table.draw();

        thenThe(jQuery(".tableContainer table")).should(beThere);
        thenThe(jQuery(".tableContainer table tr th"))
            .should(haveText("Identifier", "Name", "Age"))
            .should(haveAttribute("data-column", "id", "name", "age"));

        thenThe(jQuery(".tableContainer table tbody")).should(beThere);
        thenThe(jQuery(".tableContainer table tbody tr").eq(0).find("td"))
            .should(haveText("1", "Michael Jackson", "50"));

        thenThe(jQuery(".tableContainer table tbody tr").eq(1).find("td"))
            .should(haveText("2", "Albert Einstein", "76"));

    });

    test("Switch Data", function () {
        var model = new OO.TableModel(famousPeople());
        var table = new OO.Table(".tableContainer", model);

        table.draw();

        thenThe(jQuery(".tableContainer table"))
            .should(beThere)
            .should(haveText("Identifier", "Name", "Age"), inElement("tr th"));

        when(model.setAllData(fruits()));

        thenThe(jQuery(".tableContainer table"))
            .should(beThere)
            .should(haveText("Fruit", "Colour"), inElement("tr th"));

    });

    test("Paging", function () {
        var model = new OO.TableModel(
            jQuery.extend(famousPeople(), {
                pageSize:2,
                pageNumber:0
            })
        );

        var table = new OO.Table(".tableContainer", model);

        table.draw();

        thenThe(jQuery(".tableContainer table tbody tr")).should(haveSize(2));
        thenThe(jQuery(".tableContainer table tbody td:first-child")).should(haveText(1, 2));

        model.pageNumber = 1;
        table.draw();

        thenThe(jQuery(".tableContainer table tbody tr")).should(haveSize(2));
        thenThe(jQuery(".tableContainer table tbody td:first-child")).should(haveText(3, 4));

    });

    test("Formatting", function () {

        var model = new OO.TableModel(
            fruits()
        ).setFormatter(
            "colour",
            function (colour) {
                return "<span class='icon' data-colour='" + colour + "'></span>"
            }
        );

        var table = new OO.Table(".tableContainer", model);
        table.draw();

        thenThe(jQuery(".tableContainer tbody tr"))
            .should(haveText("Apple", "Banana", "Orange", "Red Grape"), inElement("td:first-child"))
            .should(haveAttribute("data-colour", "green", "yellow", "orange", "purple"),
                    inElement(".icon"));

    });

    test("Get Column", function () {

        var model = new OO.TableModel(
            fruits()
        );

        ok(model.getColumn("id"));
        ok(model.getColumn("colour"));
        ok(!model.getColumn("foo"))

    });

    function famousPeople() {
        return {
            columns:[
                {
                    id:"id",
                    name:"Identifier"
                },
                {
                    id:"name",
                    name:function () {
                        return "Name";
                    }
                },
                {
                    id:"age",
                    name:"Age"
                }
            ],
            data:[
                [1, "Michael Jackson", 50],
                [2, "Albert Einstein", 76],
                [3, "Abraham Lincoln", 56],
                [4, "William Shakespeare", 52]
            ]
        }
    }

    function fruits() {
        return {
            columns:[
                {
                    id:"id",
                    name:"Fruit"
                },
                {
                    id:"colour",
                    name:"Colour"
                }
            ],
            data:[
                ["Apple", "green"],
                ["Banana", "yellow"],
                ["Orange", "orange"],
                ["Red Grape", "purple"]
            ]
        }
    }

})();