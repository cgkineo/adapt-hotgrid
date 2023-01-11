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

    const isAtStart = index === 0;
    const isAtEnd = index === totalItems - 1;

    const globals = Adapt.course.get('_globals');
    const hotgridGlobals = globals._components._hotgrid;

    let prevTitle = isAtStart ? '' : this.model.getItem(index - 1).get('title');
    let nextTitle = isAtEnd ? '' : this.model.getItem(index + 1).get('title');

    let backItem = isAtStart ? null : index;
    let nextItem = isAtEnd ? null : index + 2;

    if (canCycleThroughPagination) {
      if (isAtStart) {
        prevTitle = this.model.getItem(totalItems - 1).get('title');
        backItem = totalItems;
      }
      if (isAtEnd) {
        nextTitle = this.model.getItem(0).get('title');
        nextItem = 1;
      }
    }

    const backLabel = compile(hotgridGlobals.previous, {
      _globals: globals,
      title: prevTitle,
      itemNumber: backItem,
      totalItems
    });

    const nextLabel = compile(hotgridGlobals.next, {
      _globals: globals,
      title: nextTitle,
      itemNumber: nextItem,
      totalItems
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
    const itemCount = compile(template, { itemNumber, totalItems });

    this.model.set('itemCount', itemCount);
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
