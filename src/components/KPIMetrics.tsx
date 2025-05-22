
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Audit } from "@/types/audit";
import { User } from "@/types/user";
import { getAudits, getUsers } from "@/utils/auditStorage";
import { differenceInDays, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface KPIMetricsProps {
  onClose: () => void;
}

const KPIMetrics: React.FC<KPIMetricsProps> = ({ onClose }) => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const loadedAudits = getAudits();
    const loadedUsers = getUsers();
    
    setAudits(loadedAudits);
    setUsers(loadedUsers);
  }, []);

  // Calculate duration metrics (days between stages)
  const calculateDurationMetrics = () => {
    const metrics = audits.map(audit => {
      let preparationDays = 0;
      let onsiteDays = 0;
      let monitoringDays = 0;
      
      if (audit.startDate) {
        const createdDate = parseISO(audit.createdAt);
        const startDate = parseISO(audit.startDate);
        preparationDays = differenceInDays(startDate, createdDate);
        
        if (audit.endDate) {
          const endDate = parseISO(audit.endDate);
          onsiteDays = differenceInDays(endDate, startDate);
          
          if (audit.status === "Closed") {
            const updatedDate = parseISO(audit.updatedAt);
            monitoringDays = differenceInDays(updatedDate, endDate);
          }
        }
      }
      
      return {
        name: audit.name,
        reference: audit.reference,
        preparationDays: preparationDays > 0 ? preparationDays : 0,
        onsiteDays: onsiteDays > 0 ? onsiteDays : 0, 
        monitoringDays: monitoringDays > 0 ? monitoringDays : 0,
        type: audit.type,
      };
    });
    
    return metrics;
  };
  
  // Calculate average metrics across all audits
  const calculateAverageMetrics = () => {
    const metrics = calculateDurationMetrics();
    
    if (metrics.length === 0) {
      return { avgPreparation: 0, avgOnsite: 0, avgMonitoring: 0 };
    }
    
    const totalPreparation = metrics.reduce((sum, item) => sum + item.preparationDays, 0);
    const totalOnsite = metrics.reduce((sum, item) => sum + item.onsiteDays, 0);
    const totalMonitoring = metrics.reduce((sum, item) => sum + item.monitoringDays, 0);
    
    return {
      avgPreparation: Math.round(totalPreparation / metrics.length),
      avgOnsite: Math.round(totalOnsite / metrics.length),
      avgMonitoring: Math.round(totalMonitoring / metrics.length)
    };
  };
  
  // Calculate auditor performance metrics
  const calculateAuditorMetrics = () => {
    // Get all audit types
    const auditTypes = [...new Set(audits.map(audit => audit.type))];
    
    // Get all users who are either Lead Auditors or Auditors
    const auditingUsers = users.filter(user => 
      user.role === "Lead Auditor" || user.role === "Auditor"
    );
    
    return auditingUsers.map(user => {
      // Find all audits where this user is assigned
      const userAudits = audits.filter(audit => 
        audit.assignedUsers?.some(assignedUser => 
          assignedUser.id === user.id
        )
      );
      
      // Count audits by type
      const typesCounts: Record<string, number> = {};
      auditTypes.forEach(type => {
        typesCounts[type] = userAudits.filter(audit => audit.type === type).length;
      });
      
      // Calculate missing types
      const missingTypes = auditTypes.filter(type => typesCounts[type] === 0);
      
      // Total audits count
      const totalAudits = userAudits.length;
      
      // Lead audits count (where user is lead auditor)
      const leadAudits = audits.filter(audit => 
        audit.assignedUsers?.some(assignedUser => 
          assignedUser.id === user.id && assignedUser.role === "Lead Auditor"
        )
      ).length;
      
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        totalAudits,
        leadAudits,
        typesCounts,
        missingTypes,
      };
    });
  };

  const durationMetrics = calculateDurationMetrics();
  const averageMetrics = calculateAverageMetrics();
  const auditorMetrics = calculateAuditorMetrics();
  
  // Format data for charts
  const durationChartData = durationMetrics.map(metric => ({
    name: metric.reference,
    preparation: metric.preparationDays,
    onsite: metric.onsiteDays,
    monitoring: metric.monitoringDays,
  }));
  
  const auditorChartData = auditorMetrics.map(metric => ({
    name: metric.username,
    total: metric.totalAudits,
    lead: metric.leadAudits,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <CardTitle className="text-xl">Audit KPI Metrics</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </CardHeader>
        <CardContent className="p-6 h-[calc(80vh-80px)] overflow-y-auto">
          <Tabs defaultValue="duration">
            <TabsList className="mb-6">
              <TabsTrigger value="duration">Duration Metrics</TabsTrigger>
              <TabsTrigger value="auditors">Auditor Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="duration" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Avg. Preparation Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageMetrics.avgPreparation} days</p>
                    <p className="text-sm text-gray-500">From creation to start date</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Avg. On-Site Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageMetrics.avgOnsite} days</p>
                    <p className="text-sm text-gray-500">From start to end date</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Avg. Monitoring Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{averageMetrics.avgMonitoring} days</p>
                    <p className="text-sm text-gray-500">From end date to closure</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Audit Duration Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {durationChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={durationChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="preparation" name="Preparation" fill="#8884d8" />
                        <Bar dataKey="onsite" name="On-site" fill="#82ca9d" />
                        <Bar dataKey="monitoring" name="Monitoring" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No audit data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="auditors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auditor Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {auditorChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={auditorChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" name="Total Audits" fill="#8884d8" />
                        <Bar dataKey="lead" name="Lead Auditor Role" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No auditor data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Auditor Audit Type Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {auditorMetrics.map((auditor) => (
                      <div key={auditor.id} className="border-b pb-4 last:border-0">
                        <h3 className="text-lg font-medium mb-2">
                          {auditor.username} ({auditor.role})
                        </h3>
                        <p>Total Audits: <span className="font-medium">{auditor.totalAudits}</span></p>
                        <p>Lead Auditor Role: <span className="font-medium">{auditor.leadAudits}</span></p>
                        
                        <h4 className="text-md font-medium mt-2 mb-1">Audit Types:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(auditor.typesCounts).map(([type, count]) => (
                            <div key={type} className="flex justify-between">
                              <span>{type}:</span> 
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                        
                        {auditor.missingTypes.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-700">
                              Missing audit types: {auditor.missingTypes.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIMetrics;
