
define(function(require) {

    var ComponentView = require("coreViews/componentView");
    var Adapt = require("coreJS/adapt");

    var Hotgrid = ComponentView.extend({
 
        events: {
            "click .hotgrid-item-image":"showGridItemContent"
        },
        
        isPopupOpen: false,
        
        preRender: function () {
            var items = this.model.get('_items');
            _.each(items, function(item) {
                if (item._graphic.srcHover && item._graphic.srcVisited) {
                    item._graphic.hasImageStates = true;
                }
            }, this);
            
            this.listenTo(Adapt, 'device:changed', this.resizeControl);
            
            this.setDeviceSize();
        },

        setDeviceSize: function() {
            if (Adapt.device.screenSize === 'large') {
                this.$el.addClass('desktop').removeClass('mobile');
                this.model.set('_isDesktop', true);
            } else {
                this.$el.addClass('mobile').removeClass('desktop');
                this.model.set('_isDesktop', false)
            }
        },

        postRender: function() {
            this.setupGrid();
            this.$('.hotgrid-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        },

        resizeControl: function() {
            this.setDeviceSize();
            this.render();
        },

        setupGrid: function() {
            if (this.model.get("_isDesktop")) {
                var columns = this.model.get("_columns");
                var itemWidth = 100 / columns;
                this.$(".hotgrid-grid-item").css({
                    width: itemWidth + "%"
                });
                this.setItemlayout()
            }
        },

        setItemlayout: function() {
            var columns = this.model.get("_columns");
            var itemLength = this.model.get("_items").length;
            var $items = this.$(".hotgrid-grid-item");
            var itemRemainder = itemLength % columns;
            if (itemRemainder !== 0) {
                if (itemRemainder === 1) {
                    var index = itemLength - 1;
                    var $item = $items.eq(index);
                    this.centerItem($item);
                } else {
                    var itemToAlignIndex = itemLength - itemRemainder;
                    var $item = $items.eq(itemToAlignIndex);
                    this.alignItem($item, itemRemainder);
                }
            }
        },

        centerItem: function(item) {
            item.css({
                float: "none",
                margin: "auto"
            });
        },

        alignItem: function(item, itemsToAlign) {
            var columns = this.model.get("_columns");
            var itemWidth = 100 / columns;

            if (Adapt.config.get('_defaultDirection') == 'rtl') {
                var marginRight = itemWidth / 2;
                item.css({
                    marginRight: marginRight + "%"
                });
            } else {
                var marginLeft = itemWidth / 2;
                item.css({
                    marginLeft: marginLeft + "%"
                });
            }
        },

        showGridItemContent: function(event) {
            if (event) event.preventDefault();

            if(this.isPopupOpen) return;// ensure multiple clicks don't open multiple notify popups

            var $item = $(event.currentTarget).parent();
            var currentItem = this.getCurrentItem($item.index());

            if(!currentItem.visited) {
                $item.addClass("visited");
                $(event.currentTarget).attr('aria-label', $(event.currentTarget).attr('aria-label') + ". " + this.model.get('_globals')._accessibility._ariaLabels.visited + ".");
                currentItem.visited = true;
            }

            Adapt.trigger("notify:popup", {
                title: currentItem.title,
                body: "<div class='hotgrid-notify-body'>" + currentItem.body +
                    "</div><img class='hotgrid-notify-graphic' src='" +
                    currentItem._itemGraphic.src + "' alt='" +
                    currentItem._itemGraphic.alt + "'/>"
            });

            this.isPopupOpen = true;
            Adapt.once("notify:closed", _.bind(function() {
                this.isPopupOpen = false;
            }, this));

            this.evaluateCompletion();
        },

        getCurrentItem: function(index) {
            return this.model.get('_items')[index];
        },
        
        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item.visited;
            });
        },

        evaluateCompletion: function() {
            if (this.getVisitedItems().length == this.model.get('_items').length) {
                this.setCompletionStatus();
            }
        }
        
    });
    
    Adapt.register("hotgrid", Hotgrid);
    
    return Hotgrid;

});













