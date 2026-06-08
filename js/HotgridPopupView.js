import Adapt from 'core/js/adapt';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates, compile } from 'core/js/reactHelpers';

class HotgridPopupView extends Backbone.View {

  className() {
    return 'hotgrid-popup';
  }

  initialize() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.listenToOnce(Adapt, 'notify:opened', this.onNotifyOpened);

    this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange
    });

    this.model.set('onCloseClick', this.onCloseClick.bind(this));

    // Debounce required as a second (bad) click event is dispatched on iOS causing a jump of two items.
    // this.onControlClick = _.debounce(this.onControlClick.bind(this), 100);
    this.model.set('onControlClick', this.onControlClick.bind(this));
  }

  onNotifyOpened() {
    this.setupNavigation();
    this.render();
  }

  setupNavigation() {
    this.manageBackNextStates();
    this.updatePageCount();
    this.setupBackNextLabels();
  }

  /**
   * Controls whether the back and next buttons should be enabled
   *
   * @param {Number} [index] Item's index value. Defaults to the currently active item.
   */
  manageBackNextStates(index = this.model.getActiveItem().get('_index')) {
    const totalItems = this.model.getChildren().length;
    const canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

    const shouldEnableBack = index > 0 || canCycleThroughPagination;
    const shouldEnableNext = index < totalItems - 1 || canCycleThroughPagination;

    this.model.set('shouldEnableBack', shouldEnableBack);
    this.model.set('shouldEnableNext', shouldEnableNext);
  }

  /**
   * Construct back and next aria labels
   *
   * @param {Number} [index] Item's index value.
   */
  setupBackNextLabels(index = this.model.getActiveItem().get('_index')) {
    const totalItems = this.model.getChildren().length;
    const canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

    // When looping is enabled the buttons never disable and always wrap,
    // so the active item is never treated as the start or end.
    const isAtStart = !canCycleThroughPagination && index === 0;
    const isAtEnd = !canCycleThroughPagination && index === totalItems - 1;

    const globals = Adapt.course.get('_globals');
    const hotgridGlobals = globals._components._hotgrid;

    const prevIndex = (index - 1 + totalItems) % totalItems;
    const nextIndex = (index + 1) % totalItems;

    const prevTitle = isAtStart ? '' : this.model.getItem(prevIndex).get('title');
    const nextTitle = isAtEnd ? '' : this.model.getItem(nextIndex).get('title');

    const backItem = isAtStart ? null : prevIndex + 1;
    const nextItem = isAtEnd ? null : nextIndex + 1;

    const backLabel = compile(hotgridGlobals.previous, {
      _globals: globals,
      title: prevTitle,
      itemNumber: backItem,
      totalItems,
      isAtStart
    });

    const nextLabel = compile(hotgridGlobals.next, {
      _globals: globals,
      title: nextTitle,
      itemNumber: nextItem,
      totalItems,
      isAtEnd
    });

    this.model.set('backLabel', backLabel);
    this.model.set('nextLabel', nextLabel);
  }

  updatePageCount() {
    const globals = Adapt.course.get('_globals');
    const pagingTemplate = globals._components._hotgrid.popupPagination;
    const template = pagingTemplate || '{{itemNumber}} / {{totalItems}}';
    const itemNumber = this.model.getActiveItem().get('_index') + 1;
    const totalItems = this.model.getChildren().length;
    const popupCount = compile(template, { itemNumber, totalItems });

    this.model.set('popupCount', popupCount);
  }

  onItemsActiveChange(item, _isActive) {
    if (!_isActive) return;

    const index = item.get('_index');

    this.manageBackNextStates(index);
    this.updatePageCount();
    this.render();
  }

  onCloseClick() {
    Adapt.trigger('notify:close');
  }

  onControlClick(e) {
    const direction = $(e.currentTarget).data('direction');
    const index = this.getNextIndex(direction);

    if (index !== -1) {
      this.setItemState(index);
    }
  }

  getNextIndex(direction) {
    let index = this.model.getActiveItem().get('_index');
    const lastIndex = this.model.getChildren().length - 1;

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
  }

  setItemState(index) {
    this.model.getActiveItem().toggleActive();

    const nextItem = this.model.getItem(index);
    this.setupBackNextLabels(index);
    nextItem.toggleActive();
    nextItem.toggleVisited(true);
  }

  render() {
    ReactDOM.render(<templates.hotgridPopup {...this.model.toJSON()} />, this.el);
  }

};

export default HotgridPopupView;
