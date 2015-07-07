
define(function(require) {

    var ComponentView = require("coreViews/componentView");
    var Adapt = require("coreJS/adapt");

    var Hotgrid = ComponentView.extend({
 
        events: {
            "click .hotgrid-item-image":"showGridItemContent",
            "click .content-popup-icon-close":"closeContent"

        },
        
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
            this.render();
        },

        postRender: function() {
            this.setupGrid();
            this.setReadyStatus();
            this.closeContent();
        },

        resizeControl: function() {
            this.setDeviceSize();
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
            var totalItemWidth = item.width() * itemsToAlign;
            var gridWidth = this.$(".hotgrid-grid").width();
            var marginLeft = (gridWidth - totalItemWidth) / 2;
            item.css({
                marginLeft: marginLeft + "px"
            });
        },

        showGridItemContent: function(event) {
            if (event) event.preventDefault();
            // trigger popupManager - this sets all tabindex elements to -1
            Adapt.trigger('popup:opened');
            // set close button to 0 - this prevents the user from tabbing outside of the popup whilst open
            this.$('.content-popup-icon-close').attr('tabindex', 0);
            var $item = $(event.currentTarget).parent();
            var index = $item.index();
            $item.addClass("visited");
            this.showContentWithItemIndex(index);
            var currentItem = this.getCurrentItem(index);
            currentItem.visited = true;
            this.evaluateCompletion();
            // give focus to close button 
            $(".content-popup-icon-close").focus();
        },

        showContentWithItemIndex: function(index) {
            this.$(".hotgrid-content-item").css({
                display:"none"
            });
            this.$(".hotgrid-content-item").eq(index).css({
                display:"block"
            });

            var $content = this.$(".hotgrid-content");
            $content.css({ 
                marginTop: -($content.height() / 2) + "px"
            }).velocity({
                opacity: 1,
                translateY: 0
            },{
                display: "block"
            });

            this.$(".hotgrid-shadow").velocity({
                opacity: 1
            },{
                display: "block"
            });
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
        },

        closeContent: function(event) {
            if (event) event.preventDefault();
            this.$(".hotgrid-content").velocity({
                opacity: 0,
                translateY: "-50px"
            },{
                display: "none"
            });
            // trigger popup closed to reset the tab index back to 0
            Adapt.trigger('popup:closed');

            this.$(".hotgrid-shadow").velocity({
                opacity: 0
            },{
                display: "none"
            });
        }
        
    });
    
    Adapt.register("hotgrid", Hotgrid);
    
    return Hotgrid;

});













