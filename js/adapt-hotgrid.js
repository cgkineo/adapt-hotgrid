
define(function(require) {

    var ComponentView = require("coreViews/componentView");
    var Adapt = require("coreJS/adapt");

    var Hotgrid = ComponentView.extend({
 
        events: {
            "click .hotgrid-item-image":"onItemClicked"
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

            this.checkIfResetOnRevisit();
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

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);

                _.each(this.model.get('_items'), function(item) {
                    item._isVisited = false;
                });
            }
        },

        postRender: function() {
            this.setUpColumns();
            this.$('.hotgrid-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        },

        resizeControl: function() {
            this.setDeviceSize();
            this.render();
        },

        setUpColumns: function() {
            var columns = this.model.get('_columns');

            if (columns && Adapt.device.screenSize === 'large') {
                this.$('.hotgrid-grid-item').css('width', (100 / columns) + '%');
            }
        },

        onItemClicked: function(event) {
            if (event) event.preventDefault();

            var $link = $(event.currentTarget);
            var $item = $link.parent();
            var itemModel = this.model.get('_items')[$item.index()];

            if(!itemModel._isVisited) {
                $link.addClass("visited");
                itemModel._isVisited = true;
                // append the word 'visited.' to the link's aria-label
                var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + ".";
                $link.attr('aria-label', function(index,val) {return val + " " + visitedLabel});
            }

            this.showItemContent(itemModel);

        },

        showItemContent: function(itemModel) {
            if(this.isPopupOpen) return;// ensure multiple clicks don't open multiple notify popups

            Adapt.trigger("notify:popup", {
                title: itemModel.title,
                body: "<div class='hotgrid-notify-container'><div class='hotgrid-notify-body'>" + itemModel.body + "</div>" +
					"<img class='hotgrid-notify-graphic' src='" +
                    itemModel._itemGraphic.src + "' alt='" +
                    itemModel._itemGraphic.alt + "'/></div>"
            });

            this.isPopupOpen = true;

            Adapt.once("notify:closed", _.bind(function() {
                this.isPopupOpen = false;
                this.evaluateCompletion();
            }, this));
        },
        
        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item._isVisited;
            });
        },

        evaluateCompletion: function() {
            if (this.getVisitedItems().length == this.model.get('_items').length) {
                this.setCompletionStatus();
            }
        }
        
    },{
        template: "hotgrid"
    });
    
    Adapt.register("hotgrid", Hotgrid);
    
    return Hotgrid;

});
