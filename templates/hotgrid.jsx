import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y';
import React, { useState, useEffect } from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Hotgrid(props) {
  const hotgridLabels = Adapt.course.get('_globals')._components._hotgrid;
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    onItemClicked
  } = props;

  return (
    <div className='component__inner hotgrid__inner'>

      <templates.header {...props} />

      <div className="component__widget hotgrid__widget">

        <div className="hotgrid__grid" role="list">

          {props._items.map(({ _graphic, _isRound, _isVisited, _isActive }, index) =>

            <div className="hotgrid__item" role="listitem" key={index}>

              <button className={classes([
                'hotgrid__item-btn',
                `item-${index}`,
                (_graphic.srcHover && _graphic.srcVisited) ? 'is-image' : 'is-css',
                _isRound && 'is-round',
                _isVisited && 'is-visited',
                _isActive && 'is-active'
              ])}
              onClick={onItemClicked}
              data-index={index}
              >

                <span className="aria-label">
                  {_graphic.title && _graphic.title}

                  {!_graphic.title && `${hotgridLabels.item} ${index}`}

                  {_graphic.alt && `. ${_graphic.alt}`}

                  {_isVisited && `. ${ariaLabels.visited}`}
                </span>

                <span className="hotgrid__item-btn-inner" aria-hidden="true">

                  <span className="hotgrid__item-image-container">

                    <img className="hotgrid__item-image is-default" src={_graphic.src} />

                    {_graphic.srcHover &&
                      <img className="hotgrid__item-image is-hover" src={_graphic.srcHover} />
                    }

                    {_graphic.srcVisited &&
                      <img className="hotgrid__item-image is-visited" src={_graphic.srcVisited} />
                    }

                  </span>

                  {_graphic.title &&
                  <span className="hotgrid__item-title" aria-hidden="true">
                    <span className="hotgrid__item-title-inner">
                      {_graphic.title}
                    </span>
                  </span>
                  }

                  {!_graphic.title &&
                  // item has no title - show icon instead
                  <span className="btn-icon hotgrid__item-icon">
                    <span className="icon" />
                  </span>
                  }

                </span>

              </button>

            </div>
          )}

        </div>
      </div>
    </div>

  );
}
