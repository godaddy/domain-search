import React from 'react';
import type { DomainResult, WidgetText } from '../types';

interface Props {
  domainResult: DomainResult;
  text: WidgetText;
  selected: boolean;
  onSelect: () => void;
}

const Domain: React.FC<Props> = ({ domainResult, text, selected, onSelect }) => {
  const { domain, listPrice, salePrice, extendedValidation, disclaimer } = domainResult;

  if (!domain) return <div />;

  return (
    <div className="domain-result">
      <div className="domain-name">
        {domain}
        <span className="rstore-disclaimer"><pre>{disclaimer}</pre></span>
      </div>
      <div className="purchase-info">
        {selected ? (
          <div className="rstore-message">
            <span className="dashicons dashicons-yes rstore-success" />
            <button className="rstore-domain-buy-button selected btn btn-default" onClick={onSelect}>
              {text.selected}
            </button>
          </div>
        ) : (
          <div className="rstore-message">
            {listPrice !== salePrice && (
              <span className="listPrice"><small><s>{listPrice}</s></small></span>
            )}
            {salePrice && (
              <span className="salePrice">
                <strong>{salePrice}{extendedValidation && '*'}</strong>
              </span>
            )}
            <button className="rstore-domain-buy-button select btn btn-secondary" onClick={onSelect}>
              {text.select}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Domain;
