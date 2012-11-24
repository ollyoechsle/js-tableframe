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

    test("Paging", function () {
        var model = new OO.TableModel(
            jQuery.extend(famousPeople(), {
                pageSize: 2,
                pageNumber: 0
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

})();