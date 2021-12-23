import { forwardRef } from 'react';
import type { DragHandleProps } from '../types';

const DragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
  ({ className, label, title, testID }, dragRef) => (
    <span data-testid={testID} ref={dragRef} className={className} title={title}>
      {label}
    </span>
  )
);

DragHandle.displayName = 'DragHandle';

export default DragHandle;
