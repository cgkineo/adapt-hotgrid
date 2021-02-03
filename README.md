# adapt-hotgrid

**Hotgrid** is a *presentation component* which displays a set of images in a grid layout. 

When a learner selects an image, a pop-up is displayed that consists of text with an image.

## Settings Overview

The attributes listed below are used in *components.json* to configure **Hotgrid**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-hotgrid/blob/master/example.json). 

## Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

### \_component (string):
This must be set to: `"hotgrid"`.

### \_classes (string):
CSS class name(s) to be applied to this component's containing `div`. The class(es) must be predefined in one of the Less files. Separate multiple classes with a space.

### \_layout (string):
Defines the horizontal position of the component in the block. Acceptable values are `"full"`, `"left"` or `"right"`.

### instruction (string):
This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.

### \_setCompletionOn (string):
Determines when Adapt will register this component as having been completed by the learner. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` requires each pop-up item to be visited; `"inview"` requires the **Hot Grid** component to enter the view port completely.

### \_canCycleThroughPagination (boolean):
Enables the pop-ups to be cycled through endlessly using either the previous or next icon. When set to `true`, clicking "next" on the final stage will display the very first stage. When set to `false`, the final stage will display only a "previous" icon. The default is `false`.

### \_hidePagination (boolean):
When set to `true`, hides the "previous" and "next" icons and progress indicator (e.g., "1/5") on the pop-up's toolbar. The default is `false`.

### \_columns (number):
This value determines the number of columns within the grid. Any number of columns can be set however keep in mind the more columns there are the smaller the items will be.

**Hot Grid**  has a dynamic layout system. If you have 5 items but set the columns to 3, **Hot Grid**  will put 3 items in the first row and 2 on the second. The second row then will be automatically centred. This works with any amount of items and columns - i.e. that last row will always be centred for you.

### \_items (array):
The items array contains the list of all the **Hot Grid** items. Each entry in the array should be an object, containing the following settings:

#### title (string):
The title text for the popup that is shown when the item is selected by the learner.

#### body (string):
The main text for the popup that is shown when the item is selected by the learner.

#### \_classes (string):
CSS class name(s) to be applied to the popup item. Classes available by default are:
* `"align-image-left"` (aligns the item image to the left)
* `"hide-desktop-image"` (hides the pop up image in desktop view)
* `"hide-popup-image"` (hides the pop up image for all screen sizes)

Any other classes need to be predefined in one of the Less files. Separate multiple classes with a space.

#### \_graphic (object):
The graphic object defines the image that displays for each grid item and contains the following settings:

##### title (string):
This is optional text which is displayed under the grid item image.

##### src (string):
File name (including path) of grid item image. Path should be relative to the `src` folder (e.g., `"course/en/images/c-15.png"`). 

##### srcHover (string):
The 'hover' state of the grid item image. This setting is optional and does not need to be included if, say, you are handling the 'hover' state via CSS. If you do include it you also need to include a `srcVisited` setting (see below) as well.

##### srcVisited (string):
The 'visited' state of the grid item image. This setting is optional and does not need to be included if, say, you are handling the 'visited' state via CSS. If you do include it you also need to include a `srcHover` setting (see above) as well.

##### alt (string):
The alternative text for the item image. Assign [alt text](https://github.com/adaptlearning/adapt_framework/wiki/Providing-good-alt-text) to images that convey course content only. By default, the item is labelled by the `title` (if set), otherwise a generic 'Item 1, 2, 3 etc' label is applied, followed by the alternative text (if set).

#### \_itemGraphic (object):
The itemGraphic object defines the image displayed in the popup that is shown when the item is selected by the learner. You only need to include this object if you want to display a different image in the popup. It contains the following settings:

##### src (string):
File name (including path) of the image. Path should be relative to the `src` folder (e.g. `"course/en/images/origami-menu-two.jpg"`).

##### alt (string):
The alternative text for the item popup image. Assign [alt text](https://github.com/adaptlearning/adapt_framework/wiki/Providing-good-alt-text) to images that convey course content only.

##### attribution (string):
Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.

## Accessibility
**Hotgrid** has a label assigned using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. This label is included within the *example.json* and may need to be added to the _globals in *course.json*.

## Limitations

Hotgrid automatically switches to 2 columns in mobile mode for the best user experience however this can be overridden in the CSS. 

----------------------------
**Version number:**  4.1.1  
**Framework versions:**  5+  
**Author / maintainer:**  Kineo  
**Accessibility support:**  WAI AA  
**RTL support:**  Yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 14 for macOS/iOS/iPadOS, Opera  
