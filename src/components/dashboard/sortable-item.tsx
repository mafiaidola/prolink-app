'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SortableItem(props: { id: string, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {props.children}
      <Button
        type="button"
        variant="ghost"
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 h-7 w-7 cursor-grab active:cursor-grabbing p-0"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
}
