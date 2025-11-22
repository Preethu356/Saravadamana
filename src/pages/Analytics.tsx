import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, Activity, AlertTriangle } from "lucide-react";

interface KPIData {
  totalAssessments: number;
  dailyActiveUsers: number;
  completedPlans: number;
  safetyFlags: number;
  assessmentsByType: { tool: string; count: number }[];
  activityTimeline: { date: string; events: number }[];
}

export default function Analytics() {
  const [kpis, setKpis] = useState<KPIData>({
    totalAssessments: 0,
    dailyActiveUsers: 0,
    completedPlans: 0,
    safetyFlags: 0,
    assessmentsByType: [],
    activityTimeline: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Total assessments
        const { count: assessmentCount } = await supabase
          .from("assessments")
          .select("*", { count: "exact", head: true });

        // DAU - users active in last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { data: recentInteractions } = await supabase
          .from("interactions")
          .select("user_profile_id")
          .gte("created_at", yesterday.toISOString());
        
        const uniqueUsers = new Set(recentInteractions?.map(i => i.user_profile_id) || []);

        // Completed plans (sequences with status='completed')
        const { count: completedCount } = await supabase
          .from("sequences")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed");

        // Safety flags
        const { count: safetyCount } = await supabase
          .from("safety_flags")
          .select("*", { count: "exact", head: true });

        // Assessments by type
        const { data: assessmentsByType } = await supabase
          .from("assessments")
          .select("tool");
        
        const typeCounts = (assessmentsByType || []).reduce((acc, curr) => {
          acc[curr.tool] = (acc[curr.tool] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const assessmentData = Object.entries(typeCounts).map(([tool, count]) => ({
          tool,
          count,
        }));

        // Activity timeline (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: timelineData } = await supabase
          .from("interactions")
          .select("created_at")
          .gte("created_at", sevenDaysAgo.toISOString());

        const dailyCounts = (timelineData || []).reduce((acc, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const timeline = Object.entries(dailyCounts).map(([date, events]) => ({
          date,
          events,
        }));

        setKpis({
          totalAssessments: assessmentCount || 0,
          dailyActiveUsers: uniqueUsers.size,
          completedPlans: completedCount || 0,
          safetyFlags: safetyCount || 0,
          assessmentsByType: assessmentData,
          activityTimeline: timeline,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Key performance indicators and user insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalAssessments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.dailyActiveUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.completedPlans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Flags</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.safetyFlags}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assessments by Type</CardTitle>
            <CardDescription>Distribution of assessment tools used</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpis.assessmentsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tool" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>User interactions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpis.activityTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
