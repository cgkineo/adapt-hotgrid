import Adapt from 'core/js/adapt';
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Hotgrid(props) {
  const hotgridLabels = Adapt.course.get('_globals')._components._hotgrid;
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _columnWidth,
    onItemClicked
  } = props;

  return (
    <div className='component__inner hotgrid__inner'>

      <templates.header {...props} />

      <div className="component__widget hotgrid__widget">

        <div className="hotgrid__grid" role="list">

          {props._items.map(({ _index, _graphic, _isRound, _isVisited, _isActive }) =>

            <div className="hotgrid__item" role="listitem" key={_index} style={{ width: _columnWidth + '%' }}>

              <button className={classes([
                'hotgrid__item-btn',
                `item-${_index}`,
                (_graphic.srcHover && _graphic.srcVisited) ? 'is-image' : 'is-css',
                _isRound && 'is-round',
                _isVisited && 'is-visited',
                _isActive && 'is-active'
              ])}
              onClick={onItemClicked}
              data-index={_index}
              >

                <span className="aria-label">
                  {/* Show either graphic title or generic title */}
                  {_graphic.title && _graphic.title}
                  {!_graphic.title && `${hotgridLabels.item} ${_index}`}

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
                  // item has a title
                  <span className="hotgrid__item-title" aria-hidden="true">
                    <span
                      className="hotgrid__item-title-inner"
                      dangerouslySetInnerHTML={{ __html: _graphic.title }}
                    />
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
