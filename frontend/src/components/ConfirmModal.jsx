import React from 'react';

export default function ConfirmModal({ open, title='Confirm', message='Are you sure?', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop z-50">
      <div className="bg-white p-6 rounded-xl card-neu w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={onConfirm} className="btn-soft rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
