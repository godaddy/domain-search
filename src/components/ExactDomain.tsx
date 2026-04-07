import React from 'react';
import type { DomainResult, WidgetText } from '../types';

interface Props {
  domainResult: DomainResult;
  text: WidgetText;
}

const ExactDomain: React.FC<Props> = ({ domainResult, text }) => {
  if (domainResult.available) {
    return (
      <p className="available">
        {text.available.replace('{domain_name}', domainResult.domain)}
      </p>
    );
  }

  return (
    <p className="not-available">
      {text.notAvailable.replace('{domain_name}', domainResult.domain)}
    </p>
  );
};

export default ExactDomain;
