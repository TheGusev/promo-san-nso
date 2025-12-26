import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Database, Trash2, Calendar, Server, FileText, Users, MessageSquare, Activity, RotateCcw, Play } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: logsData } = await supabase
        .from('data_cleanup_logs')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(10);
      
      setCleanupLogs(logsData || []);

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

  const runManualCleanup = async () => {
    setActionLoading('cleanup');
    try {
      const { data, error } = await supabase.rpc('cleanup_old_data');
      if (error) throw error;
      
      const result = data as { deleted_traffic_events?: number; deleted_leads?: number } | null;
      toast({
        title: "Очистка выполнена",
        description: `Удалено: ${result?.deleted_traffic_events || 0} событий, ${result?.deleted_leads || 0} заявок`,
      });
      await fetchData();
    } catch (error: any) {
      toast({
        title: "Ошибка очистки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setShowCleanupDialog(false);
    }
  };

  const resetMVT = async () => {
    setActionLoading('reset');
    try {
      const { error } = await supabase.rpc('reset_mvt_arm_params', {
        p_test_name: 'main_variant'
      });
      if (error) throw error;
      
      toast({
        title: "MVT-тест сброшен",
        description: "Все параметры α/β обнулены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка сброса",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setShowResetDialog(false);
    }
  };

  const statCards = [
    { title: 'Заявки', value: stats.leadsCount, icon: FileText, color: 'text-blue-500' },
    { title: 'Отзывы', value: stats.reviewsCount, icon: MessageSquare, color: 'text-green-500' },
    { title: 'События', value: stats.trafficEventsCount, icon: Activity, color: 'text-orange-500' },
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Настройки</h2>
        <p className="text-sm text-muted-foreground">Мониторинг и управление</p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCleanupDialog(true)}
              disabled={!!actionLoading}
            >
              {actionLoading === 'cleanup' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Очистка данных
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              disabled={!!actionLoading}
            >
              {actionLoading === 'reset' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Сбросить MVT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={!!actionLoading}
            >
              <Play className="h-4 w-4 mr-2" />
              Обновить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stat.value.toLocaleString('ru-RU')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Database Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">База данных</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">Платформа</span>
              </div>
              <p className="text-sm font-semibold">Lovable Cloud</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">Ретеншн</span>
              </div>
              <p className="text-sm font-semibold">90 дней</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Автоочистка</h4>
                <p className="text-xs text-muted-foreground">
                  Ежедневно в 03:00 UTC
                </p>
              </div>
              <Badge variant="default" className="text-xs">Активна</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cleanup Logs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Логи очистки</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {cleanupLogs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Trash2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Логов пока нет</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">События</TableHead>
                    <TableHead className="text-right">Заявки</TableHead>
                    <TableHead className="text-right">Всего</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cleanupLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.executed_at), 'd.MM.yy HH:mm', { locale: ru })}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {log.deleted_traffic_events}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {log.deleted_leads}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {log.deleted_traffic_events + log.deleted_leads}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cleanup Dialog */}
      <AlertDialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Запустить очистку?</AlertDialogTitle>
            <AlertDialogDescription>
              Будут удалены записи traffic_events и leads старше 90 дней.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={runManualCleanup} disabled={!!actionLoading}>
              {actionLoading === 'cleanup' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Запустить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset MVT Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сбросить MVT-тест?</AlertDialogTitle>
            <AlertDialogDescription>
              Все параметры α и β будут сброшены до 1, счётчики показов, конверсий и выручки обнулятся.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={resetMVT} disabled={!!actionLoading}>
              {actionLoading === 'reset' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сбросить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
