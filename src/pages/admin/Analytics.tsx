import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Users, FileText, TrendingUp, DollarSign, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
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
  const [exporting, setExporting] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const { toast } = useToast();
  
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [leadsByDay, setLeadsByDay] = useState<LeadsByDay[]>([]);
  const [utmData, setUtmData] = useState<UTMData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);

  // Store raw data for export
  const [rawLeads, setRawLeads] = useState<any[]>([]);
  const [rawEvents, setRawEvents] = useState<any[]>([]);

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
      const { data: sessionsData } = await supabase
        .from('traffic_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());
      
      setRawEvents(sessionsData || []);
      const uniqueSessions = new Set(sessionsData?.map(s => s.session_id) || []).size;
      setTotalSessions(uniqueSessions);

      const { data: leadsData, count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      setRawLeads(leadsData || []);
      setTotalLeads(leadsCount || 0);

      const cr = uniqueSessions > 0 ? ((leadsCount || 0) / uniqueSessions * 100) : 0;
      setConversionRate(parseFloat(cr.toFixed(2)));

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
      const eventsByType: Record<string, Set<string>> = {};
      sessionsData?.forEach(event => {
        if (!eventsByType[event.event_type]) {
          eventsByType[event.event_type] = new Set();
        }
        eventsByType[event.event_type].add(event.session_id);
      });

      setFunnelData([
        { name: 'Визиты', value: uniqueSessions, fill: 'hsl(var(--primary))' },
        { name: 'Скролл 50%', value: eventsByType['scroll_50']?.size || 0, fill: 'hsl(var(--chart-2))' },
        { name: 'Калькулятор', value: eventsByType['calc_open']?.size || 0, fill: 'hsl(var(--chart-3))' },
        { name: 'Заявки', value: leadsCount || 0, fill: 'hsl(var(--chart-4))' },
      ]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({ title: "Нет данных для экспорта", variant: "destructive" });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(';'),
      ...data.map(row => 
        headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return JSON.stringify(val);
          return String(val).replace(/;/g, ',');
        }).join(';')
      )
    ];

    const blob = new Blob(['\ufeff' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type: 'leads' | 'events' | 'summary') => {
    setExporting(type);
    try {
      if (type === 'leads') {
        exportToCSV(rawLeads, 'leads');
        toast({ title: `Экспортировано ${rawLeads.length} заявок` });
      } else if (type === 'events') {
        exportToCSV(rawEvents, 'traffic_events');
        toast({ title: `Экспортировано ${rawEvents.length} событий` });
      } else {
        const summary = [{
          period: period,
          sessions: totalSessions,
          leads: totalLeads,
          conversion_rate: conversionRate,
          revenue: totalRevenue,
          export_date: new Date().toISOString()
        }];
        exportToCSV(summary, 'summary');
        toast({ title: "Сводка экспортирована" });
      }
    } finally {
      setExporting(null);
    }
  };

  const metrics: MetricCard[] = [
    { title: 'Сессии', value: totalSessions.toLocaleString('ru-RU'), icon: Users },
    { title: 'Заявки', value: totalLeads.toLocaleString('ru-RU'), icon: FileText },
    { title: 'Конверсия', value: `${conversionRate}%`, icon: TrendingUp },
    { title: 'Выручка', value: `${totalRevenue.toLocaleString('ru-RU')} ₽`, icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Аналитика</h2>
        <div className="flex items-center gap-2">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as '7d' | '30d' | '90d')}>
            <TabsList className="h-8">
              <TabsTrigger value="7d" className="text-xs px-2">7д</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs px-2">30д</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs px-2">90д</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('leads')}
          disabled={!!exporting}
        >
          {exporting === 'leads' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Заявки CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('events')}
          disabled={!!exporting}
        >
          {exporting === 'events' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          События CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('summary')}
          disabled={!!exporting}
        >
          {exporting === 'summary' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Сводка
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Leads by Day */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Динамика заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={30} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Воронка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Источники</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utmData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="source" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={30} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Устройства</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="device"
                    label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
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
