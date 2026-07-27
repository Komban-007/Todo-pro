/* agent-notes: { ctx: "Individual Task Item card component with inline edit, priority badge, and completion state", deps: [src/types/todo.ts], state: active, last: "sato@2026-07-24" } */

'use client';

import React, { useState } from 'react';
import { Task, Priority } from '../types/todo';
import { Check, Trash2, Edit2, Calendar, Clock, Bell, Repeat, GripVertical, Save, X } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onUpdate,
  onDelete,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, {
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory.trim() || 'General',
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const priorityColors = {
    P1: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    P2: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    P3: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  };

  const isOverdue = !task.completed && task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <div
      className={`glass-card p-3.5 rounded-xl flex items-center justify-between gap-3 group transition-all ${
        task.completed ? 'opacity-55 line-through bg-slate-100/50 dark:bg-slate-900/30' : ''
      }`}
    >
      {/* Drag handle & Checkbox */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-blue-600 border-blue-600 text-white animate-check'
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white/50 dark:bg-slate-800/50'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Content / Inline Edit */}
        {isEditing ? (
          <div className="flex-1 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="flex-1 min-w-[150px] px-2 py-1 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 border border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
            />
            <select
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as Priority)}
              className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
            <button onClick={handleSaveEdit} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold tracking-tight truncate ${task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                {task.title}
              </span>

              {/* Priority Badge */}
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>

              {/* Category Tag */}
              {task.category && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {task.category}
                </span>
              )}
            </div>

            {/* Sub-info: Date, Reminder, Recurrence */}
            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {task.dueDate && (
                <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-red-500 dark:text-red-400' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                  {task.dueTime && (
                    <span className="flex items-center gap-0.5 ml-1">
                      <Clock className="w-3 h-3" />
                      {task.dueTime}
                    </span>
                  )}
                </span>
              )}

              {task.reminderEnabled && (
                <span className="flex items-center gap-0.5 text-indigo-500">
                  <Bell className="w-3 h-3" />
                  <span>Remind</span>
                </span>
              )}

              {task.recurrence !== 'none' && (
                <span className="flex items-center gap-0.5 text-emerald-500 capitalize">
                  <Repeat className="w-3 h-3" />
                  <span>{task.recurrence}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(!isEditing)}
          title="Edit Task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          title="Delete Task"
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
