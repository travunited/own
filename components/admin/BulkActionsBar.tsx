'use client';

import { useState } from 'react';
import { CheckCircle, Users, Download, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onApprove: () => void;
  onAssign: () => void;
  onExport: () => void;
  onClear: () => void;
  admins: any[];
  processing: boolean;
}

export default function BulkActionsBar({
  selectedCount,
  onApprove,
  onAssign,
  onExport,
  onClear,
  admins,
  processing,
}: BulkActionsBarProps) {
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState('');

  const handleAssign = () => {
    if (selectedAdmin) {
      onAssign();
      setShowAssignDropdown(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4 animate-slide-in-bottom">
        {/* Count */}
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-primary-600" />
          <span className="font-bold text-primary-900">{selectedCount} selected</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            disabled={processing}
            className="btn-primary flex items-center px-4 py-2 text-sm disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve All
          </button>

          <div className="relative">
            <button
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              disabled={processing}
              className="btn-outline flex items-center px-4 py-2 text-sm disabled:opacity-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Assign to Admin
            </button>

            {showAssignDropdown && (
              <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-2">
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select admin...</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.full_name} ({admin.role})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedAdmin}
                  className="w-full btn-primary py-2 text-sm disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onExport}
            disabled={processing}
            className="btn-outline flex items-center px-4 py-2 text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Clear */}
        <button
          onClick={onClear}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

