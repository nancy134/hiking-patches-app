'use client';

import React from 'react';
import { Season } from '@/API';

type FiltersDialogProps = {
  open: boolean;
  onClose: () => void;

  // current filter state
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;

  selectedDifficulty: string;
  setSelectedDifficulty: (v: string) => void;

  winterOnly: boolean;
  setWinterOnly: (v: boolean) => void;

  // user-status filters
  user: any; // or your User type
  isMyView: boolean;
  userDataReady: boolean;

  onlyMyPatches: boolean;
  setOnlyMyPatches: (v: boolean) => void;

  showCompleted: boolean;
  setShowCompleted: (v: boolean) => void;

  showInProgress: boolean;
  setShowInProgress: (v: boolean) => void;

  showWishlisted: boolean;
  setShowWishlisted: (v: boolean) => void;

  // actions
  hasActiveFilters: boolean;
  onClearAll: () => void;

  // optional: spinner component
  DotSpinner: React.ComponentType;
};

export default function FiltersDialog({
  open,
  onClose,

  selectedRegion,
  setSelectedRegion,
  selectedDifficulty,
  setSelectedDifficulty,
  winterOnly,
  setWinterOnly,

  user,
  isMyView,
  userDataReady,

  onlyMyPatches,
  setOnlyMyPatches,
  showCompleted,
  setShowCompleted,
  showInProgress,
  setShowInProgress,
  showWishlisted,
  setShowWishlisted,

  hasActiveFilters,
  onClearAll,

  DotSpinner,
}: FiltersDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close filters"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-4xl rounded-lg bg-white shadow-lg sm:w-[95vw] lg:w-[900px]">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-base font-semibold text-gray-900">Filters</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* State */}
            <div>
              <label className="mr-2 font-semibold">State:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="p-2 border rounded min-w-[160px]"
              >
                <option value="">All Regions</option>
                <option value="Any Location">Any Location</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Florida">Florida</option>
                <option value="Maine">Maine</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New York">New York</option>
                <option value="Vermont">Vermont</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="mr-2 font-semibold">Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-2 border rounded min-w-[160px]"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MODERATE">Moderate</option>
                <option value="HARD">Hard</option>
                <option value="EXTRA_HARD">Extra Hard</option>
                <option value="EXTRA_EXTRA_HARD">Extra Extra Hard</option>
              </select>
            </div>

            {/* Winter */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={winterOnly}
                onChange={(e) => setWinterOnly(e.target.checked)}
              />
              <span className="font-semibold">Winter</span>
            </label>

            {/* Status filters */}
            {user && (
              <fieldset
                className="w-full flex flex-wrap items-center gap-3 rounded border border-gray-200 px-3 py-2"
                aria-busy={!userDataReady}
              >
               <legend className="px-1 text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    Filter by my status
                    {!userDataReady && <DotSpinner />}
                  </span>
                </legend>
 
                {!isMyView && (
                  <label
                    className={`flex items-center gap-2 ${
                      !userDataReady ? 'opacity-60' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={onlyMyPatches}
                      onChange={(e) => setOnlyMyPatches(e.target.checked)}
                      disabled={!userDataReady}
                    />
                    <span>Only show my patches</span>
                  </label>
                )}

                <label className={`flex items-center gap-1 ${!userDataReady ? 'opacity-60' : ''}`}>
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    disabled={!userDataReady}
                  />
                  <span>Completed</span>
                </label>

                <label className={`flex items-center gap-1 ${!userDataReady ? 'opacity-60' : ''}`}>
                  <input
                    type="checkbox"
                    checked={showInProgress}
                    onChange={(e) => setShowInProgress(e.target.checked)}
                    disabled={!userDataReady}
                  />
                  <span>In Progress</span>
                </label>

                <label className={`flex items-center gap-1 ${!userDataReady ? 'opacity-60' : ''}`}>
                  <input
                    type="checkbox"
                    checked={showWishlisted}
                    onChange={(e) => setShowWishlisted(e.target.checked)}
                    disabled={!userDataReady}
                  />
                  <span>Wishlisted</span>
                </label>
              </fieldset>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
          <button
            type="button"
            onClick={onClearAll}
            disabled={!hasActiveFilters}
            className="
              rounded-md border border-red-300 bg-red-50
              px-3 py-2 text-sm font-semibold text-red-700
              hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

