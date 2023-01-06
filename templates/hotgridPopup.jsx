import React from 'react';
import { classes, templates } from 'core/js/reactHelpers';

export default function Hotgrid(props) {

  return (
    <div className='hotgrid-popup__inner'>

      {props._items.map(({ title, body, _itemGraphic, _graphic, _classes, _isVisited, _isActive, _isRound, _imageAlignment }, index) =>
        <div className={classes([
          'hotgrid-popup__item',
          { _classes },
          _isRound && 'is-round',
          _isVisited && 'is-visited',
          _isActive && 'is-active',
          _imageAlignment && `align-image-${_imageAlignment}`
        ])}
        key={index}
        data-index={index}
        aria-hidden={!_isActive && null}
        >

          <div className="hotgrid-popup__item-content">
            <div className="hotgrid-popup__item-content-inner">

              {title &&
              <div
                id={_isActive ? 'notify-heading' : null}
                className="hotgrid-popup__item-title"
                // {{a11y_attrs_heading 'notify'}}
              >
                <div className="hotgrid-popup__item-title-inner">
                  {title}
                </div>
              </div>
              }

              {body &&
              <div className="hotgrid-popup__item-body">
                <div className="hotgrid-popup__item-body-inner">
                  {body}
                </div>
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
              aria-label={_itemGraphic.alt || _graphic.alt}
              aria-hidden={!_itemGraphic.alt && !_graphic.alt ? true : null}
            />

            {_itemGraphic.attribution &&
            <div className="component__attribution hotgrid-popup__attribution">
              <div className="component__attribution-inner hotgrid-popup__attribution-inner">
                {_itemGraphic.attribution}
              </div>
            </div>
            }

          </div>

        </div>
      )}

      <templates.hotgridPopupToolbar {...props} />

    </div>

  );
}
