import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, Trash2, Calendar, Server, FileText, Users, MessageSquare, Activity } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface CleanupLog {
  id: string;
  deleted_traffic_events: number;
  deleted_leads: number;
  executed_at: string;
}

interface SystemStats {
  leadsCount: number;
  reviewsCount: number;
  trafficEventsCount: number;
  mvtImpressionsCount: number;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [cleanupLogs, setCleanupLogs] = useState<CleanupLog[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    leadsCount: 0,
    reviewsCount: 0,
    trafficEventsCount: 0,
    mvtImpressionsCount: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch cleanup logs
      const { data: logsData } = await supabase
        .from('data_cleanup_logs')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(10);
      
      setCleanupLogs(logsData || []);

      // Fetch stats
      const [
        { count: leadsCount },
        { count: reviewsCount },
        { count: trafficEventsCount },
        { count: mvtImpressionsCount },
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('traffic_events').select('*', { count: 'exact', head: true }),
        supabase.from('mvt_impressions').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        leadsCount: leadsCount || 0,
        reviewsCount: reviewsCount || 0,
        trafficEventsCount: trafficEventsCount || 0,
        mvtImpressionsCount: mvtImpressionsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Заявки', value: stats.leadsCount, icon: FileText, color: 'text-blue-500' },
    { title: 'Отзывы', value: stats.reviewsCount, icon: MessageSquare, color: 'text-green-500' },
    { title: 'События трафика', value: stats.trafficEventsCount, icon: Activity, color: 'text-orange-500' },
    { title: 'MVT-показы', value: stats.mvtImpressionsCount, icon: Users, color: 'text-purple-500' },
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
      <div>
        <h2 className="text-2xl font-bold">Настройки системы</h2>
        <p className="text-muted-foreground">Мониторинг базы данных и логи очистки</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString('ru-RU')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Database Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Информация о базе данных</CardTitle>
          </div>
          <CardDescription>
            Статус подключения и настройки хранения
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Платформа</span>
              </div>
              <p className="text-lg font-semibold">Lovable Cloud</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Срок хранения</span>
              </div>
              <p className="text-lg font-semibold">90 дней</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Автоочистка данных</h4>
                <p className="text-sm text-muted-foreground">
                  Удаляет старые записи traffic_events и leads каждые 24 часа
                </p>
              </div>
              <Badge variant="default">Активна</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cleanup Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Логи очистки данных</CardTitle>
          </div>
          <CardDescription>
            История автоматического удаления устаревших записей
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cleanupLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Логи очистки пока отсутствуют</p>
              <p className="text-sm">Очистка запускается автоматически по расписанию</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата выполнения</TableHead>
                  <TableHead className="text-right">Удалено событий</TableHead>
                  <TableHead className="text-right">Удалено заявок</TableHead>
                  <TableHead className="text-right">Всего удалено</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cleanupLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.executed_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.deleted_traffic_events.toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.deleted_leads.toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {(log.deleted_traffic_events + log.deleted_leads).toLocaleString('ru-RU')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
