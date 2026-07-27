/* agent-notes: { ctx: "Settings modal for JSON backup export/import and notifications permission", deps: [src/types/todo.ts, src/utils/storage.ts, src/utils/notifications.ts], state: active, last: "sato@2026-07-24" } */

'use client';

import React, { useState } from 'react';
import { Task } from '../types/todo';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';
import { requestNotificationPermission } from '../utils/notifications';
import { X, Download, Upload, Bell, ShieldCheck, FileText } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImportTasks: (tasks: Task[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportBackupJSON(tasks);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-pro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const imported = importBackupJSON(content);
        onImportTasks(imported);
        setImportStatus(`Successfully restored ${imported.length} tasks!`);
      } catch (err) {
        setImportStatus('Failed to import backup. Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setNotificationStatus(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Backup & Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Notifications Permission */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Reminders & Notifications</p>
                <p className="text-xs text-slate-500 capitalize">Status: {notificationStatus}</p>
              </div>
            </div>
            {notificationStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all"
              >
                Enable
              </button>
            )}
          </div>

          {/* Export Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Export Backup JSON</p>
                <p className="text-xs text-slate-500">Save all your tasks locally</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all"
            >
              Export
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Restore from Backup</p>
                <p className="text-xs text-slate-500">Upload a saved `.json` file</p>
              </div>
            </div>
            <label className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all cursor-pointer">
              Upload
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs font-semibold text-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 p-2.5 rounded-xl">
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
