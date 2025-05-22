
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChecklistNavigationProps {
  clauses: Array<{ id: string; clause: string }>;
  activeClauseId: string | null;
  onClauseClick: (id: string) => void;
}

const ChecklistNavigation: React.FC<ChecklistNavigationProps> = ({
  clauses,
  activeClauseId,
  onClauseClick
}) => {
  // Group clauses by their primary number (e.g., 145.A.30, 145.A.35)
  const groupedClauses: Record<string, Array<{ id: string; clause: string }>> = {};
  
  clauses.forEach(clause => {
    const match = clause.clause.match(/^(\d+\.\w+\.\d+)/);
    if (match) {
      const mainClause = match[1];
      if (!groupedClauses[mainClause]) {
        groupedClauses[mainClause] = [];
      }
      groupedClauses[mainClause].push(clause);
    }
  });

  return (
    <div className="w-60 bg-gray-50 rounded-lg shadow p-3 flex-shrink-0 sticky top-4">
      <h3 className="text-sm font-semibold mb-2 px-3">Quick Navigation</h3>
      <ScrollArea className="h-[calc(100vh-260px)]">
        <div className="pr-4">
          {Object.entries(groupedClauses).map(([mainClause, items]) => (
            <div key={mainClause} className="mb-2">
              <div className="space-y-1">
                {items.map(item => (
                  <button
                    key={item.id}
                    className={`w-full text-left px-3 py-1 text-xs rounded-md transition-colors
                      ${activeClauseId === item.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-200'}`}
                    onClick={() => onClauseClick(item.id)}
                  >
                    {item.clause}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChecklistNavigation;
