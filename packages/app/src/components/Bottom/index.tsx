import './index.scss';

import React from 'react';

import { Zoom } from './Zoom';
export function Bottom() {
  return (
    <div className="drawease-app-bottom">
      <div className="drawease-app-bottom-left">
        <Zoom />
      </div>
      <div className="drawease-app-bottom-right"></div>
    </div>
  );
}
