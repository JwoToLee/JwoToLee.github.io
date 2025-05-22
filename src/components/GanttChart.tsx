
import React, { useState, useEffect } from "react";
import { Bar, BarChart, Cell, LegendProps, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Audit } from "@/types/audit";
import { getAudits } from "@/utils/auditStorage";
import { format, differenceInDays, parseISO } from "date-fns";

interface GanttChartProps {
  onClose: () => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ onClose }) => {
  const [audits, setAudits] = useState<Audit[]>([]);

  useEffect(() => {
    const loadedAudits = getAudits();
    const filteredAudits = loadedAudits.filter(audit => audit.startDate && audit.endDate);
    
    // Sort audits by start date
    const sortedAudits = filteredAudits.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    setAudits(sortedAudits);
  }, []);

  // Prepare data for the Gantt chart
  const prepareGanttData = () => {
    const today = new Date();
    
    return audits.map(audit => {
      const startDate = parseISO(audit.startDate);
      const endDate = parseISO(audit.endDate);
      const duration = differenceInDays(endDate, startDate) + 1; // +1 to include the end date
      
      // Determine audit progress status
      let statusColor;
      let progress = 0;
      
      if (today < startDate) {
        statusColor = "#9b87f5"; // Purple for not started
        progress = 0;
      } else if (today > endDate) {
        statusColor = "#4CAF50"; // Green for completed
        progress = 100;
      } else {
        // In progress - calculate percentage
        const totalDays = duration;
        const daysElapsed = differenceInDays(today, startDate);
        progress = Math.round((daysElapsed / totalDays) * 100);
        statusColor = "#FF9800"; // Amber for in progress
      }
      
      // Find lead auditor if available
      const leadAuditor = audit.assignedUsers?.find(user => user.role === "Lead Auditor");
      
      return {
        name: audit.name,
        reference: audit.reference,
        start: format(startDate, "MMM d"),
        end: format(endDate, "MMM d"),
        duration,
        progress,
        statusColor,
        leadAuditor: leadAuditor?.username || "Unassigned",
        status: audit.status,
        startTimestamp: startDate.getTime(),
        endTimestamp: endDate.getTime()
      };
    });
  };
  
  const ganttData = prepareGanttData();
  
  // Legend data
  const legendItems = [
    { value: "Not Started", color: "#9b87f5" },
    { value: "In Progress", color: "#FF9800" },
    { value: "Completed", color: "#4CAF50" }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <CardTitle className="text-xl">Audit Progress Gantt Chart</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </CardHeader>
        <CardContent className="p-6 flex flex-col h-[calc(80vh-80px)]">
          {ganttData.length > 0 ? (
            <>
              <div className="flex justify-center space-x-8 mb-4">
                {legendItems.map((item) => (
                  <div key={item.value} className="flex items-center">
                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto pb-4">
                <ResponsiveContainer width="100%" height={ganttData.length * 60 + 50}>
                  <BarChart
                    data={ganttData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                  >
                    <XAxis 
                      type="number" 
                      domain={[
                        ganttData.length > 0 ? Math.min(...ganttData.map(d => d.startTimestamp)) : 0,
                        ganttData.length > 0 ? Math.max(...ganttData.map(d => d.endTimestamp)) : 0
                      ]}
                      tickFormatter={(timestamp) => format(new Date(timestamp), "MMM d")}
                      scale="time"
                      dataKey="value" 
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={150}
                      tickFormatter={(value, index) => {
                        const item = ganttData[index];
                        return `${value} (${item.reference})`;
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-bold">{data.name} ({data.reference})</p>
                              <p>Lead: {data.leadAuditor}</p>
                              <p>Status: {data.status}</p>
                              <p>Duration: {data.duration} days</p>
                              <p>Period: {data.start} - {data.end}</p>
                              <p>Progress: {data.progress}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="duration" barSize={20}>
                      {ganttData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.statusColor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No audit data available with start and end dates</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttChart;
