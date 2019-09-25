define([
    'core/js/adapt'
], function(Adapt) {
    'use strict';

    var HotgridPopupView = Backbone.View.extend({

        className: 'hotgrid-popup',

        events: {
            'click .hotgrid-popup-done': 'closePopup',
            'click .hotgrid-popup-controls': 'onControlClick'
        },

        initialize: function() {
            // Debounce required as a second (bad) click event is dispatched on iOS causing a jump of two items.
            this.onControlClick = _.debounce(this.onControlClick.bind(this), 100);
            this.listenToOnce(Adapt, 'notify:opened', this.onOpened);
            this.listenTo(this.model.get('_children'), {
                'change:_isActive': this.onItemsActiveChange,
                'change:_isVisited': this.onItemsVisitedChange
            });
            this.render();
        },

        onOpened: function() {
            this.applyNavigationClasses(this.model.getActiveItem().get('_index'));
            this.updatePageCount();
            this.handleTabs();
        },

        applyNavigationClasses: function (index) {
            var itemCount = this.model.get('_items').length;
            var canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

            var shouldEnableBack = index > 0 || canCycleThroughPagination;
            var shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;
            var $controls = this.$('.hotgrid-popup-controls');

            this.$('hotgrid-popup-nav')
                .toggleClass('first', !shouldEnableBack)
                .toggleClass('last', !shouldEnableNext);

            $controls.filter('.back').a11y_cntrl_enabled(shouldEnableBack);
            $controls.filter('.next').a11y_cntrl_enabled(shouldEnableNext);
        },

        updatePageCount: function() {
            var template = Adapt.course.get('_globals')._components._hotgrid.popupPagination || '{{itemNumber}} / {{totalItems}}';
            var labelText = Handlebars.compile(template || '')({
                itemNumber: this.model.getActiveItem().get('_index') + 1,
                totalItems: this.model.get('_items').length
            });
            this.$('.hotgrid-popup-count').html(labelText);
        },

        handleTabs: function() {
            this.$('.hotgrid-item:not(.active) *').a11y_on(false);
            this.$('.hotgrid-item.active *').a11y_on(true);
        },

        onItemsActiveChange: function(item, _isActive) {
            if (!_isActive) return;

            var index = item.get('_index');
            this.updatePageCount();
            this.handleTabs();
            this.applyItemClasses(index);
            this.handleFocus(index);
        },

        applyItemClasses: function(index) {
            this.$('.hotgrid-item[data-index="' + index + '"]').addClass('active').removeAttr('aria-hidden');
            this.$('.hotgrid-item[data-index="' + index + '"] .hotgrid-content-title').attr("id", "notify-heading");
            this.$('.hotgrid-item:not([data-index="' + index + '"])').removeClass('active').attr('aria-hidden', 'true');
            this.$('.hotgrid-item:not([data-index="' + index + '"]) .hotgrid-content-title').removeAttr("id");
        },

        handleFocus: function(index) {
            this.$('.hotgrid-popup-inner .active').a11y_focus();
            this.applyNavigationClasses(index);
        },

        onItemsVisitedChange: function(item, _isVisited) {
            if (!_isVisited) return;

            this.$('.hotgrid-item')
                .filter('[data-index="' + item.get('_index') + '"]')
                .addClass('visited');
        },

        render: function() {
            var data = this.model.toJSON();
            data.view = this;
            var template = Handlebars.templates['hotgridPopup'];
            this.$el.html(template(data));
        },

        closePopup: function(event) {
            Adapt.trigger('notify:close');
        },

        onControlClick: function(event) {
            var direction = $(event.currentTarget).hasClass('back') ? 'back' : 'next';
            var index = this.getNextIndex(direction);

            if (index !== -1) {
                this.setItemState(index);
            }
        },

        getNextIndex: function(direction) {
            var index = this.model.getActiveItem().get('_index');
            var lastIndex = this.model.get('_items').length - 1;

            switch (direction) {
                case 'back':
                    if (index > 0) return --index;
                    if (this.model.get('_canCycleThroughPagination')) return lastIndex;
                    break;
                case 'next':
                    if (index < lastIndex) return ++index;
                    if (this.model.get('_canCycleThroughPagination')) return 0;
            }
            return -1;
        },

        setItemState: function(index) {
            this.model.getActiveItem().toggleActive();

            var nextItem = this.model.getItem(index);
            nextItem.toggleActive();
            nextItem.toggleVisited(true);
        }

    });

    return HotgridPopupView;

});
