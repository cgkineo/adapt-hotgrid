import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import React from 'react';
import { templates, classes, compile } from 'core/js/reactHelpers';

export default function Hotgrid(props) {
  const hotgridGlobals = Adapt.course.get('_globals')._components._hotgrid;
  const ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

  const {
    _items,
    _columns,
    _isRound,
    _showPlusIcon,
    onItemClicked
  } = props;

  const hasColumnLayout = device.isScreenSizeMin('medium');

  const itemAriaLabel = (_index, _graphic, _isVisited) => {
    const arr = [];
    const separator = '. ';

    // Visited state
    if (_isVisited) arr.push(ariaLabels.visited);

    // Show either graphic title or generic title
    if (_graphic.title) {
      arr.push(_graphic.title);
    } else {
      arr.push(`${hotgridGlobals.item} ${_index}`);
    }

    // Graphic alt text
    if (_graphic.alt) arr.push(_graphic.alt);

    return { __html: arr.join(separator) };
  };

  return (
    <div className='component__inner hotgrid__inner'>

      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'hotgrid__widget',
          _columns && hasColumnLayout && 'has-column-layout'
        ])}
      >

        <div className="hotgrid__grid" role="list">

          {_items.map(({ _index, _graphic, _isVisited, _isActive }) =>

            <div
              className={classes([
                'hotgrid__item',
                _graphic._classes
              ])}
              role="listitem"
              key={_index}
            >

              <button className={classes([
                'hotgrid__item-btn',
                `item-${_index}`,
                (_graphic.srcHover && _graphic.srcVisited) ? 'is-image' : 'has-css-states',
                _isRound && 'is-round',
                _isVisited && 'is-visited',
                _isActive && 'is-active'
              ])}
              onClick={onItemClicked}
              data-index={_index}
              >

                <span className="aria-label" dangerouslySetInnerHTML={ itemAriaLabel(_index, _graphic, _isVisited) } />

                <span className="hotgrid__item-btn-inner" aria-hidden="true">

                  <span className="hotgrid__item-image-container">

                    <img className="hotgrid__item-image is-default" src={_graphic.src} />

                    {_graphic.srcHover &&
                      <img className="hotgrid__item-image is-hover" src={_graphic.srcHover} />
                    }

                    {_graphic.srcVisited &&
                      <img className="hotgrid__item-image is-visited" src={_graphic.srcVisited} />
                    }

                    {(_showPlusIcon || _isVisited) &&
                    <span className="btn-icon hotgrid__item-icon" aria-hidden="true">
                      <span className="icon" />
                    </span>
                    }

                  </span>

                  {_graphic.title &&
                  // item has a title
                  <span className="hotgrid__item-title" aria-hidden="true">
                    <span
                      className="hotgrid__item-title-inner"
                      dangerouslySetInnerHTML={{ __html: compile(_graphic.title) }}
                    />
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
