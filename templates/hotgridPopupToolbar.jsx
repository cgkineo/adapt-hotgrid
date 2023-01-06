import Adapt from 'core/js/adapt';
import React from 'react';
import { classes } from 'core/js/reactHelpers';

export default function HotgridPopupToolbar(props) {
  const a11yConfig = Adapt.config.get('_accessibility');
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _hidePagination
  } = props;

  return (
    <div className={classes([
      'hotgrid-popup__toolbar',
      _hidePagination && 'hide-pagination'
    ])}>

      {!_hidePagination &&
      <div className="hotgrid-popup__nav">

        <button className="btn-icon hotgrid-popup__controls back js-hotgrid-control-click" aria-label={ariaLabels.previous}>
          <span className="icon" />
        </button>

        <div className="hotgrid-popup__count" />

        <button className="btn-icon hotgrid-popup__controls next js-hotgrid-control-click" aria-label={ariaLabels.next}>
          <span className="icon" />
        </button>

      </div>
      }

      <button className="btn-icon hotgrid-popup__close js-hotgrid-popup-close" aria-label={ariaLabels.closePopup}>
        <span className="icon" />
      </button>

      {a11yConfig._options._isPopupWrapFocusEnabled &&
      <a className="a11y-focusguard a11y-ignore a11y-ignore-focus" tabIndex="0" role="presentation">&nbsp;</a>
      }

    </div>
  );
}
