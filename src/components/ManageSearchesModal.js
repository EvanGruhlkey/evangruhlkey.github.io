import { useState } from 'react';
import { Button } from './ui/button';

export function ManageSearchesModal({ isOpen, onClose, searches, onEdit, onDelete, onCreateNew }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-sentient font-bold">Manage Searches</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-foreground/5 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {searches.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-sentient font-semibold mb-2">No saved searches yet</h3>
              <p className="font-mono text-sm text-foreground/60 mb-6">
                Create your first search to start finding great deals
              </p>
              <Button onClick={onCreateNew}>
                Create New Search
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {searches.map((search) => (
                <div
                  key={search.id}
                  className="bg-background/40 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-mono text-base font-semibold">{search.name}</h3>
                        <div className={`w-2 h-2 rounded-full ${search.active ? 'bg-primary' : 'bg-foreground/20'}`} />
                      </div>
                      <p className="font-mono text-sm text-foreground/60 mb-3">
                        {search.results} results found
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(search)}
                          className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${search.name}"?`)) {
                              onDelete(search.id);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searches.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-border">
            <p className="font-mono text-sm text-foreground/60">
              {searches.length} saved search{searches.length !== 1 ? 'es' : ''}
            </p>
            <Button onClick={onCreateNew}>
              Create New Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}






