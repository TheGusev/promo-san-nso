import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, FileText, TrendingUp, DollarSign, Smartphone, Monitor, Tablet } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ru } from "date-fns/locale";

interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: number;
}

interface LeadsByDay {
  date: string;
  leads: number;
}

interface UTMData {
  source: string;
  count: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface FunnelStep {
  name: string;
  value: number;
  fill: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Metrics
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  // Chart data
  const [leadsByDay, setLeadsByDay] = useState<LeadsByDay[]>([]);
  const [utmData, setUtmData] = useState<UTMData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);

  const getPeriodDays = () => {
    switch (period) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const days = getPeriodDays();
    const startDate = startOfDay(subDays(new Date(), days));
    const endDate = endOfDay(new Date());

    try {
      // Fetch unique sessions
      const { data: sessionsData, count: sessionsCount } = await supabase
        .from('traffic_events')
        .select('session_id', { count: 'exact', head: false })
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());
      
      const uniqueSessions = new Set(sessionsData?.map(s => s.session_id) || []).size;
      setTotalSessions(uniqueSessions);

      // Fetch leads
      const { data: leadsData, count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      setTotalLeads(leadsCount || 0);

      // Calculate conversion rate
      const cr = uniqueSessions > 0 ? ((leadsCount || 0) / uniqueSessions * 100) : 0;
      setConversionRate(parseFloat(cr.toFixed(2)));

      // Calculate total revenue
      const revenue = leadsData?.reduce((sum, lead) => sum + (lead.final_price || 0), 0) || 0;
      setTotalRevenue(revenue);

      // Leads by day
      const leadsByDayMap: Record<string, number> = {};
      for (let i = days - 1; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        leadsByDayMap[date] = 0;
      }
      leadsData?.forEach(lead => {
        const date = format(new Date(lead.created_at!), 'yyyy-MM-dd');
        if (leadsByDayMap[date] !== undefined) {
          leadsByDayMap[date]++;
        }
      });
      setLeadsByDay(Object.entries(leadsByDayMap).map(([date, leads]) => ({
        date: format(new Date(date), 'd MMM', { locale: ru }),
        leads
      })));

      // UTM sources
      const utmMap: Record<string, number> = {};
      leadsData?.forEach(lead => {
        const source = lead.utm_source || 'Прямой';
        utmMap[source] = (utmMap[source] || 0) + 1;
      });
      setUtmData(Object.entries(utmMap)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5));

      // Device types
      const deviceMap: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
      leadsData?.forEach(lead => {
        const device = lead.device_type || 'desktop';
        deviceMap[device] = (deviceMap[device] || 0) + 1;
      });
      setDeviceData([
        { device: 'Мобильные', count: deviceMap.mobile },
        { device: 'Десктоп', count: deviceMap.desktop },
        { device: 'Планшеты', count: deviceMap.tablet },
      ]);

      // Funnel data
      const { data: eventsData } = await supabase
        .from('traffic_events')
        .select('event_type, session_id')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      const eventsByType: Record<string, Set<string>> = {};
      eventsData?.forEach(event => {
        if (!eventsByType[event.event_type]) {
          eventsByType[event.event_type] = new Set();
        }
        eventsByType[event.event_type].add(event.session_id);
      });

      setFunnelData([
        { name: 'Визиты', value: uniqueSessions, fill: 'hsl(var(--primary))' },
        { name: 'Скролл 50%', value: eventsByType['scroll_50']?.size || 0, fill: 'hsl(var(--chart-2))' },
        { name: 'Открыли калькулятор', value: eventsByType['calc_open']?.size || 0, fill: 'hsl(var(--chart-3))' },
        { name: 'Заявки', value: leadsCount || 0, fill: 'hsl(var(--chart-4))' },
      ]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics: MetricCard[] = [
    { title: 'Уникальные сессии', value: totalSessions.toLocaleString('ru-RU'), icon: Users },
    { title: 'Заявки', value: totalLeads.toLocaleString('ru-RU'), icon: FileText },
    { title: 'Конверсия', value: `${conversionRate}%`, icon: TrendingUp },
    { title: 'Выручка (расчёт)', value: `${totalRevenue.toLocaleString('ru-RU')} ₽`, icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Аналитика</h2>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as '7d' | '30d' | '90d')}>
          <TabsList>
            <TabsTrigger value="7d">7 дней</TabsTrigger>
            <TabsTrigger value="30d">30 дней</TabsTrigger>
            <TabsTrigger value="90d">90 дней</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads by Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Динамика заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                    name="Заявки"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Воронка конверсий</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" name="Сессии">
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* UTM Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Источники трафика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utmData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="source" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Заявки" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Устройства</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    nameKey="device"
                    label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
