/**
 * Compose multiple refs into a single ref callback
 */
import { Ref, RefCallback } from 'react';

export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
}
