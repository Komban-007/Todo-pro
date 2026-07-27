/* agent-notes: { ctx: "TaskList component with drag and drop reordering and confetti trigger", deps: [src/types/todo.ts, src/components/TaskItem.tsx], state: active, last: "sato@2026-07-24" } */

'use client';

import React from 'react';
import { Task } from '../types/todo';
import { TaskItem } from './TaskItem';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import { CheckCircle2, Inbox } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
  onReorder,
}) => {
  const handleToggleWithConfetti = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (target && !target.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    onToggle(id);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onReorder(items);
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center my-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-500 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No tasks found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          You are all caught up! Add a new task above or adjust your search filter to stay productive.
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks-droppable">
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2.5 min-h-[100px]"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(providedDraggable, snapshot) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    className={snapshot.isDragging ? 'scale-[1.02] shadow-xl z-50' : ''}
                  >
                    <TaskItem
                      task={task}
                      onToggle={handleToggleWithConfetti}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      dragHandleProps={providedDraggable.dragHandleProps as unknown as Record<string, unknown>}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
