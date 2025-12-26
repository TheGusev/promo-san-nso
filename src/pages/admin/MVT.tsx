import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FlaskConical, Eye, TrendingUp, DollarSign, RefreshCw, RotateCcw, Lock, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyMap, type VariantId, type Intent } from "@/config/copyMap";
import { Json } from "@/integrations/supabase/types";
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

interface ArmParams {
  id: string;
  test_name: string;
  intent: string;
  variant_key: string;
  alpha: number;
  beta: number;
  impressions_count: number;
  conversions_count: number;
  revenue_sum: number;
}

interface TestConfig {
  id: string;
  test_name: string;
  description: string | null;
  variants: Json;
  is_active: boolean;
  exploration_sessions_per_variant: number;
  confidence_threshold: number;
  winner_variant: string | null;
}

type SamplingMode = 'thompson' | 'random' | 'winner_lock';

export default function MVT() {
  const [loading, setLoading] = useState(true);
  const [armParams, setArmParams] = useState<ArmParams[]>([]);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent>('default');
  const [previewVariant, setPreviewVariant] = useState<VariantId>('A');
  const [explorationThreshold, setExplorationThreshold] = useState(50);
  const [samplingMode, setSamplingMode] = useState<SamplingMode>('thompson');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMVTData();
  }, []);

  const fetchMVTData = async () => {
    setLoading(true);
    try {
      const { data: armsData, error: armsError } = await supabase
        .from('mvt_arm_params')
        .select('*')
        .eq('test_name', 'main_variant')
        .order('variant_key');

      if (armsError) throw armsError;
      setArmParams(armsData || []);

      const { data: configData, error: configError } = await supabase
        .from('mvt_test_config')
        .select('*')
        .eq('test_name', 'main_variant')
        .maybeSingle();

      if (configError) throw configError;
      setTestConfig(configData);
      
      if (configData) {
        setExplorationThreshold(configData.exploration_sessions_per_variant);
        if (configData.winner_variant) {
          setSamplingMode('winner_lock');
        } else {
          setSamplingMode('thompson');
        }
      }
    } catch (error) {
      console.error('Error fetching MVT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTestActive = async () => {
    if (!testConfig) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('mvt_test_config')
        .update({ is_active: !testConfig.is_active })
        .eq('id', testConfig.id);

      if (error) throw error;
      setTestConfig({ ...testConfig, is_active: !testConfig.is_active });
      toast({ title: testConfig.is_active ? "Тест остановлен" : "Тест запущен" });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateExplorationThreshold = async () => {
    if (!testConfig) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('mvt_test_config')
        .update({ exploration_sessions_per_variant: explorationThreshold })
        .eq('id', testConfig.id);

      if (error) throw error;
      setTestConfig({ ...testConfig, exploration_sessions_per_variant: explorationThreshold });
      toast({ title: "Порог обновлён" });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const lockWinner = async (variant: string) => {
    if (!testConfig) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('mvt_test_config')
        .update({ winner_variant: variant, is_active: false })
        .eq('id', testConfig.id);

      if (error) throw error;
      setTestConfig({ ...testConfig, winner_variant: variant, is_active: false });
      setSamplingMode('winner_lock');
      toast({ title: `Вариант ${variant} закреплён как победитель` });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const unlockWinner = async () => {
    if (!testConfig) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('mvt_test_config')
        .update({ winner_variant: null, is_active: true })
        .eq('id', testConfig.id);

      if (error) throw error;
      setTestConfig({ ...testConfig, winner_variant: null, is_active: true });
      setSamplingMode('thompson');
      toast({ title: "Победитель разблокирован, тест возобновлён" });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const resetParams = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc('reset_mvt_arm_params', {
        p_test_name: 'main_variant',
        p_intent: selectedIntent === 'default' ? null : selectedIntent
      });

      if (error) throw error;
      await fetchMVTData();
      setShowResetDialog(false);
      toast({ title: "Параметры сброшены", description: selectedIntent === 'default' ? "Все intent" : `Intent: ${selectedIntent}` });
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const calculateTheta = (alpha: number, beta: number) => alpha / (alpha + beta);

  const filteredArms = armParams.filter(arm => arm.intent === selectedIntent);
  const totalImpressions = filteredArms.reduce((sum, arm) => sum + (arm.impressions_count || 0), 0);
  const totalConversions = filteredArms.reduce((sum, arm) => sum + (arm.conversions_count || 0), 0);
  const totalRevenue = filteredArms.reduce((sum, arm) => sum + Number(arm.revenue_sum || 0), 0);

  const leader = filteredArms.length > 0 
    ? filteredArms.reduce((max, arm) => {
        const theta = calculateTheta(arm.alpha, arm.beta);
        const maxTheta = calculateTheta(max.alpha, max.beta);
        return theta > maxTheta ? arm : max;
      })
    : null;

  const variants = testConfig?.variants as string[] || ['A', 'B', 'C', 'D', 'E', 'F'];
  const explorationTotal = (testConfig?.exploration_sessions_per_variant || 50) * variants.length;
  const isExplorationPhase = totalImpressions < explorationTotal;

  const intents: { value: Intent; label: string }[] = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'flat_bedbugs', label: 'Клопы (квартира)' },
    { value: 'flat_cockroaches', label: 'Тараканы (квартира)' },
    { value: 'office_disinfection', label: 'Офис' },
    { value: 'warehouse_deratization', label: 'Склад' },
    { value: 'restaurant_disinfection', label: 'Ресторан' },
    { value: 'ses_check_preparation', label: 'Подготовка к СЭС' },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">A/B-тестирование</h2>
          <p className="text-sm text-muted-foreground">Thompson Sampling MAB</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMVTData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Управление тестом</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {testConfig?.is_active ? <Play className="h-4 w-4 text-green-500" /> : <Pause className="h-4 w-4 text-muted-foreground" />}
                <Label className="text-sm">Статус</Label>
              </div>
              <Switch
                checked={testConfig?.is_active || false}
                onCheckedChange={toggleTestActive}
                disabled={saving || !!testConfig?.winner_variant}
              />
            </div>

            {/* Exploration threshold */}
            <div className="flex items-center gap-2 p-3 rounded-lg border">
              <Label className="text-sm whitespace-nowrap">Порог:</Label>
              <Input
                type="number"
                value={explorationThreshold}
                onChange={(e) => setExplorationThreshold(parseInt(e.target.value) || 50)}
                className="w-20 h-8"
                min={10}
                max={1000}
              />
              <Button size="sm" variant="ghost" onClick={updateExplorationThreshold} disabled={saving}>
                ✓
              </Button>
            </div>

            {/* Winner lock */}
            <div className="p-3 rounded-lg border">
              {testConfig?.winner_variant ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Победитель: <strong>{testConfig.winner_variant}</strong></span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={unlockWinner} disabled={saving}>
                    Разблокировать
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Select onValueChange={lockWinner} disabled={saving}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Закрепить победителя" />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Reset */}
            <Button 
              variant="outline" 
              className="h-auto py-3"
              onClick={() => setShowResetDialog(true)}
              disabled={saving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Сбросить α/β
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Статус</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-1">
              <Badge variant={testConfig?.is_active ? "default" : "secondary"} className="text-xs">
                {testConfig?.is_active ? 'Активен' : 'Стоп'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {isExplorationPhase ? 'Explore' : 'Exploit'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Показы</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalImpressions.toLocaleString('ru-RU')}</div>
            <p className="text-[10px] text-muted-foreground">Порог: {explorationTotal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Конверсии</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalConversions}</div>
            <p className="text-[10px] text-muted-foreground">
              CR: {totalImpressions > 0 ? (totalConversions / totalImpressions * 100).toFixed(2) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalRevenue.toLocaleString('ru-RU')} ₽</div>
          </CardContent>
        </Card>
      </div>

      {/* Intent Selector */}
      <div className="flex items-center gap-2">
        <Label className="text-sm">Intent:</Label>
        <Select value={selectedIntent} onValueChange={(v) => setSelectedIntent(v as Intent)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {intents.map(intent => (
              <SelectItem key={intent.value} value={intent.value}>
                {intent.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Variants Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Варианты теста</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Вар.</TableHead>
                <TableHead className="text-right">Показы</TableHead>
                <TableHead className="text-right">Conv</TableHead>
                <TableHead className="text-right">CR%</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Выручка</TableHead>
                <TableHead className="text-right hidden md:table-cell">α</TableHead>
                <TableHead className="text-right hidden md:table-cell">β</TableHead>
                <TableHead className="text-right">θ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => {
                const arm = filteredArms.find(a => a.variant_key === variant);
                const impressions = arm?.impressions_count || 0;
                const conversions = arm?.conversions_count || 0;
                const revenue = Number(arm?.revenue_sum || 0);
                const alpha = arm?.alpha || 1;
                const beta = arm?.beta || 1;
                const theta = calculateTheta(alpha, beta);
                const cr = impressions > 0 ? (conversions / impressions * 100) : 0;
                const isLeader = leader?.variant_key === variant;

                return (
                  <TableRow key={variant} className={cn(isLeader && "bg-primary/5")}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          isLeader ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {variant}
                        </span>
                        {isLeader && <Badge className="text-[10px] px-1 py-0">★</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{impressions}</TableCell>
                    <TableCell className="text-right text-sm">{conversions}</TableCell>
                    <TableCell className="text-right text-sm">{cr.toFixed(1)}%</TableCell>
                    <TableCell className="text-right text-sm hidden sm:table-cell">{revenue.toLocaleString('ru-RU')} ₽</TableCell>
                    <TableCell className="text-right font-mono text-sm hidden md:table-cell">{alpha.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-sm hidden md:table-cell">{beta.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn("font-mono text-sm font-bold", isLeader && "text-primary")}>
                        {theta.toFixed(3)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Copy Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Превью копирайта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Label className="text-sm">Вариант:</Label>
            <Select value={previewVariant} onValueChange={(v) => setPreviewVariant(v as VariantId)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map(variant => (
                  <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <h3 className="text-lg font-bold">
              {copyMap[selectedIntent]?.[previewVariant]?.title || copyMap.default[previewVariant].title}
              {(copyMap[selectedIntent]?.[previewVariant]?.highlight || copyMap.default[previewVariant].highlight) && (
                <span className="text-primary ml-2">
                  {copyMap[selectedIntent]?.[previewVariant]?.highlight || copyMap.default[previewVariant].highlight}
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {copyMap[selectedIntent]?.[previewVariant]?.subtitle || copyMap.default[previewVariant].subtitle}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                {copyMap[selectedIntent]?.[previewVariant]?.cta_primary || copyMap.default[previewVariant].cta_primary}
              </Button>
              <Button size="sm" variant="outline">
                {copyMap[selectedIntent]?.[previewVariant]?.cta_secondary || copyMap.default[previewVariant].cta_secondary}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сбросить параметры?</AlertDialogTitle>
            <AlertDialogDescription>
              Все α и β будут сброшены до 1, счётчики обнулятся.
              {selectedIntent !== 'default' && ` Только для intent: ${selectedIntent}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={resetParams} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сбросить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
