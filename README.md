adapt-hotgrid
===========

This presentation component takes a set of images and display them in a grid layout. When an image is clicked a modal is shown containing related content.

###Example JSON

Configuration options are explained below.

```
{
    "_id":"c-15",
    "_parentId":"b-15",
    "_type":"component",
    "_component":"hotgrid",
    "_classes":"",
    "_layout":"full",
    "title":"Adapt Hotgrid",
    "displayTitle":"Adapt Hotgrid",
    "body":"Body text",
    "instruction":"",
    "_columns":3,
    "_items": [
        {
            "title": "Grid Item 1",
            "body": "This is display text 1.",
            "_graphic": {
                "src": "course/en/images/gqcq-2-small.gif",
                "srcHover":"course/en/images/gqcq-1-small.gif",
                "srcVisited":"course/en/images/gqcq-1-small.gif",
                "alt": "",
                "title": ""
            },
             "_itemGraphic": {
                "src": "course/en/images/gqcq-2-small.gif",
                "alt": "alt text"
            }
        },
        {
            "title": "Grid Item 2",
            "body": "This is display text 2.",
            "_graphic": {
                "src": "course/en/images/gqcq-2-small.gif",
                "srcHover":"course/en/images/gqcq-1-small.gif",
                "srcVisited":"course/en/images/gqcq-1-small.gif",
                "alt": "",
                "title": ""
            },
             "_itemGraphic": {
                "src": "course/en/images/gqcq-1-small.gif",
                "alt": "alt text"
            }
        },
        {
            "title": "Grid Item 3",
            "body": "This is display text 3.",
            "_graphic": {
                "src": "course/en/images/gqcq-2-small.gif",
                "srcHover":"course/en/images/gqcq-1-small.gif",
                "srcVisited":"course/en/images/gqcq-1-small.gif",
                "alt": "",
                "title": ""
            },
             "_itemGraphic": {
                "src": "course/en/images/gqcq-2-small.gif",
                "alt": "alt text"
            }
        }
    ]
}
```

###Config options

#####Columns

```
"_columns":3,
```

Any number of columns can be set on the grid. Be careful with setting a high number here since the more columns there are the smaller the items will be.

Hotgrid has a dynamic layout system. If you have 5 items but set the columns to 3, hotgrid will put 3 items in the first row and 2 on the second. The second row then will be automatically centred. This works with any amount of items and columns - ie that last row will always be centred for you. 

Hotgrid automatically switches to 2 columns in mobile mode for the best user experience. This can be overridden in the css.

####Items

```
{
    "title": "Grid Item 1",
    "body": "This is display text 1",
    "_graphic": {
        "src": "course/en/images/gqcq-2-small.gif",
        "srcHover":"course/en/images/gqcq-1-small.gif",
        "srcVisited":"course/en/images/gqcq-1-small.gif",
        "alt": "",
        "title": ""
    },
     "_itemGraphic": {
        "src": "course/en/images/gqcq-2-small.gif",
        "alt": "alt text"
    }
}
```

An item is setup using the above JSON.

The graphic requires 3 images for each state - default, hover and visited.

The title, body and item graphic appear in the modal pop up when the graphic is clicked.
