import React, { useEffect } from 'react';
import a11y from 'core/js/a11y';
import { classes, compile, templates } from 'core/js/reactHelpers';

export default function HotgridPopup(props) {

  const {
    _items,
    _isRound
  } = props;

  useEffect(() => {
    const activeItem = _items.filter(item => item._isActive);

    if (!activeItem.length) return;

    const activeItemIndex = activeItem[0]._index;
    const focusElement = $(`.hotgrid-popup__item[data-index=${activeItemIndex}]`);

    a11y.focusFirst(focusElement);
  });

  return (
    <div className='hotgrid-popup__inner'>

      {_items.map(({ title, body, _itemGraphic, _graphic, _classes, _isVisited, _isActive, _imageAlignment }, index) =>
        <div className={classes([
          'hotgrid-popup__item',
          _classes,
          _isRound && 'is-round',
          _isVisited && 'is-visited',
          _isActive && 'is-active',
          _imageAlignment && `align-image-${_imageAlignment}`
        ])}
        key={index}
        data-index={index}
        aria-hidden={!_isActive ? true : null}
        >

          <div className="hotgrid-popup__item-content">
            <div className="hotgrid-popup__item-content-inner">

              {title &&
              <div
                className={classes([
                  'hotgrid-popup__item-title',
                  _isActive && 'notify-heading'
                ])}
                role="heading"
                aria-level={a11y.ariaLevel({ level: 'notify' })}
              >
                <div
                  className="hotgrid-popup__item-title-inner"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              </div>
              }

              {body &&
              <div className="hotgrid-popup__item-body">
                <div
                  className="hotgrid-popup__item-body-inner"
                  dangerouslySetInnerHTML={{ __html: compile(body) }}
                />
              </div>
              }

            </div>
          </div>

          <div className={classes([
            'hotgrid-popup__item-image-container',
            _itemGraphic.attribution && 'has-attribution'
          ])}
          >

            <img
              className="hotgrid-popup__item-image"
              src={_itemGraphic.src || _graphic.src}
              aria-label={(_itemGraphic.alt || _graphic.alt) ? _itemGraphic.alt || _graphic.alt : null}
              aria-hidden={!_itemGraphic.alt && !_graphic.alt ? true : null}
            />

            {_itemGraphic.attribution &&
            <div className="component__attribution hotgrid-popup__attribution">
              <div
                className="component__attribution-inner hotgrid-popup__attribution-inner"
                dangerouslySetInnerHTML={{ __html: _itemGraphic.attribution }}
              />
            </div>
            }

          </div>

        </div>
      )}

      <templates.hotgridPopupToolbar {...props} />

    </div>

  );
}
