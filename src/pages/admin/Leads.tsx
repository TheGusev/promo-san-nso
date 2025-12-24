import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Calendar, CheckCircle, Clock, Send, Copy } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Lead = {
  id: string;
  name: string;
  phone: string;
  service: string | null;
  object_type: string | null;
  status: string | null;
  created_at: string | null;
  review_code: string | null;
  review_code_used: boolean | null;
};

const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Завершена",
  cancelled: "Отменена",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      let query = supabase
        .from("leads")
        .select("id, name, phone, service, object_type, status, created_at, review_code, review_code_used")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

      toast({
        title: "Статус обновлён",
        description: `Заявка переведена в статус "${statusLabels[newStatus]}"`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateReviewCode = async (lead: Lead) => {
    setGeneratingCode(lead.id);
    try {
      const response = await supabase.functions.invoke("generate-review-code", {
        body: { leadId: lead.id },
      });

      if (response.error) throw new Error(response.error.message);

      const { code } = response.data;

      setLeads(leads.map(l => l.id === lead.id ? { ...l, review_code: code } : l));

      toast({
        title: "Код сгенерирован",
        description: `Код ${code} отправлен в Telegram`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка генерации кода",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingCode(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Скопировано",
      description: `Код ${code} скопирован в буфер обмена`,
    });
  };

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
        <h2 className="text-2xl font-bold">Заявки</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Фильтр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
            <SelectItem value="cancelled">Отменённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Заявки не найдены
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                      {lead.created_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(lead.created_at), "d MMM yyyy, HH:mm", { locale: ru })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={statusColors[lead.status || "new"]}>
                    {statusLabels[lead.status || "new"]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {lead.service && (
                    <Badge variant="outline">{lead.service}</Badge>
                  )}
                  {lead.object_type && (
                    <Badge variant="secondary">{lead.object_type}</Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={lead.status || "new"}
                    onValueChange={(value) => updateStatus(lead.id, value)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">
                        <span className="flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Новая
                        </span>
                      </SelectItem>
                      <SelectItem value="in_progress">
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3" /> В работе
                        </span>
                      </SelectItem>
                      <SelectItem value="completed">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" /> Завершена
                        </span>
                      </SelectItem>
                      <SelectItem value="cancelled">Отменена</SelectItem>
                    </SelectContent>
                  </Select>

                  {lead.status === "completed" && (
                    <>
                      {lead.review_code ? (
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={lead.review_code_used ? "secondary" : "default"}
                            className="font-mono text-sm"
                          >
                            {lead.review_code}
                            {lead.review_code_used && " (использован)"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyCode(lead.review_code!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateReviewCode(lead)}
                          disabled={generatingCode === lead.id}
                        >
                          {generatingCode === lead.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Сгенерировать код отзыва
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
