JS TableFrame
=============

A tiny (1 KB), event-based table framework for JavaScript apps.

Example:

```
jQuery(function () {
    var model = new js.TableModel(),
        view = new js.Table(".tableContainer", model);

    model.setAllData(
        {
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
                    name:"Age",
                    formatter:function (age, person) {
                        return person[3] - person[2];
                    }
                }
            ],
            data:[
                [1, "Michael Jackson", 1958, 2009],
                [2, "Albert Einstein", 1879, 1955],
                [3, "Abraham Lincoln", 1809, 1865],
                [4, "William Shakespeare", 1564, 1616]
            ]
        });

});
```

Dependencies
------------

* ECMAScript5 (use es5shim if not on a modern browser)
* jQuery
* Mustache
* Subscribable (https://github.com/steveukx/Subscribable)
