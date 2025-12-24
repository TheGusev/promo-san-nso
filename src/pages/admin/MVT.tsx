import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FlaskConical, Eye, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyMap, type VariantId, type Intent } from "@/config/copyMap";
import { Json } from "@/integrations/supabase/types";

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

export default function MVT() {
  const [loading, setLoading] = useState(true);
  const [armParams, setArmParams] = useState<ArmParams[]>([]);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent>('default');
  const [previewVariant, setPreviewVariant] = useState<VariantId>('A');

  useEffect(() => {
    fetchMVTData();
  }, []);

  const fetchMVTData = async () => {
    setLoading(true);
    try {
      // Fetch arm params
      const { data: armsData, error: armsError } = await supabase
        .from('mvt_arm_params')
        .select('*')
        .eq('test_name', 'main_variant')
        .order('variant_key');

      if (armsError) throw armsError;
      setArmParams(armsData || []);

      // Fetch test config
      const { data: configData, error: configError } = await supabase
        .from('mvt_test_config')
        .select('*')
        .eq('test_name', 'main_variant')
        .maybeSingle();

      if (configError) throw configError;
      setTestConfig(configData);
    } catch (error) {
      console.error('Error fetching MVT data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Thompson Sampling theta for each arm
  const calculateTheta = (alpha: number, beta: number) => {
    return alpha / (alpha + beta);
  };

  // Get arms for selected intent
  const filteredArms = armParams.filter(arm => arm.intent === selectedIntent);
  
  // Calculate totals
  const totalImpressions = filteredArms.reduce((sum, arm) => sum + (arm.impressions_count || 0), 0);
  const totalConversions = filteredArms.reduce((sum, arm) => sum + (arm.conversions_count || 0), 0);
  const totalRevenue = filteredArms.reduce((sum, arm) => sum + Number(arm.revenue_sum || 0), 0);

  // Find leader
  const leader = filteredArms.length > 0 
    ? filteredArms.reduce((max, arm) => {
        const theta = calculateTheta(arm.alpha, arm.beta);
        const maxTheta = calculateTheta(max.alpha, max.beta);
        return theta > maxTheta ? arm : max;
      })
    : null;

  // Determine phase
  const variants = testConfig?.variants as string[] || ['A', 'B', 'C', 'D', 'E', 'F'];
  const explorationThreshold = (testConfig?.exploration_sessions_per_variant || 50) * variants.length;
  const isExplorationPhase = totalImpressions < explorationThreshold;

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">A/B-тестирование</h2>
          <p className="text-muted-foreground">Thompson Sampling Multi-Armed Bandit</p>
        </div>
        <Button variant="outline" onClick={fetchMVTData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Test Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Статус</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={testConfig?.is_active ? "default" : "secondary"}>
                {testConfig?.is_active ? 'Активен' : 'Остановлен'}
              </Badge>
              <Badge variant={isExplorationPhase ? "outline" : "default"}>
                {isExplorationPhase ? 'Exploration' : 'Exploitation'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Показы</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString('ru-RU')}</div>
            <p className="text-xs text-muted-foreground">
              Порог: {explorationThreshold}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Конверсии</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString('ru-RU')}</div>
            <p className="text-xs text-muted-foreground">
              CR: {totalImpressions > 0 ? (totalConversions / totalImpressions * 100).toFixed(2) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('ru-RU')} ₽</div>
          </CardContent>
        </Card>
      </div>

      {/* Intent Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Intent:</span>
        <Select value={selectedIntent} onValueChange={(v) => setSelectedIntent(v as Intent)}>
          <SelectTrigger className="w-[250px]">
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
        <CardHeader>
          <CardTitle className="text-lg">Варианты теста</CardTitle>
          <CardDescription>
            Параметры Thompson Sampling для intent: {selectedIntent}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Вариант</TableHead>
                <TableHead className="text-right">Показы</TableHead>
                <TableHead className="text-right">Конверсии</TableHead>
                <TableHead className="text-right">CR%</TableHead>
                <TableHead className="text-right">Выручка</TableHead>
                <TableHead className="text-right">α</TableHead>
                <TableHead className="text-right">β</TableHead>
                <TableHead className="text-right">θ (Theta)</TableHead>
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
                  <TableRow 
                    key={variant}
                    className={cn(isLeader && "bg-primary/5")}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          isLeader ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {variant}
                        </span>
                        {isLeader && <Badge variant="default" className="text-xs">Лидер</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{impressions.toLocaleString('ru-RU')}</TableCell>
                    <TableCell className="text-right">{conversions.toLocaleString('ru-RU')}</TableCell>
                    <TableCell className="text-right">{cr.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{revenue.toLocaleString('ru-RU')} ₽</TableCell>
                    <TableCell className="text-right font-mono">{alpha.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono">{beta.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-mono font-bold",
                        isLeader && "text-primary"
                      )}>
                        {theta.toFixed(4)}
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
        <CardHeader>
          <CardTitle className="text-lg">Превью копирайта</CardTitle>
          <CardDescription>
            Как выглядит Hero-секция для каждого варианта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium">Вариант:</span>
            <Select value={previewVariant} onValueChange={(v) => setPreviewVariant(v as VariantId)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map(variant => (
                  <SelectItem key={variant} value={variant}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 rounded-lg bg-muted/50 space-y-4">
            <h3 className="text-2xl font-bold">
              {copyMap[selectedIntent]?.[previewVariant]?.title || copyMap.default[previewVariant].title}
              {copyMap[selectedIntent]?.[previewVariant]?.highlight && (
                <span className="text-primary ml-2">
                  {copyMap[selectedIntent]?.[previewVariant]?.highlight}
                </span>
              )}
            </h3>
            <p className="text-muted-foreground">
              {copyMap[selectedIntent]?.[previewVariant]?.subtitle || copyMap.default[previewVariant].subtitle}
            </p>
            <div className="flex gap-4">
              <Button>
                {copyMap[selectedIntent]?.[previewVariant]?.cta_primary || copyMap.default[previewVariant].cta_primary}
              </Button>
              <Button variant="outline">
                {copyMap[selectedIntent]?.[previewVariant]?.cta_secondary || copyMap.default[previewVariant].cta_secondary}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
