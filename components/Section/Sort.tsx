import React, { FC, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface ItemType {
  id: number;
  name: string;
}

export const SortExample: FC = props => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: 'shrek' },
    { id: 2, name: 'fiona' },
  ]);

  return (
    <ReactSortable list={state} setList={setState}>
      {state.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};
