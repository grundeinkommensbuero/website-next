import React from 'react';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';

export const SelectWrapped = ({ input, children, label, meta }) => (
  <LabelInputErrorWrapper label={label} meta={meta}>
    <select {...input}>{children}</select>
  </LabelInputErrorWrapper>
);
