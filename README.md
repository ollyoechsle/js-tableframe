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
                    name:"Age"
                }
            ],
            data:[
                [1, "Michael Jackson", 50],
                [2, "Albert Einstein", 76],
                [3, "Abraham Lincoln", 56],
                [4, "William Shakespeare", 52]
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
