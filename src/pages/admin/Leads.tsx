import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Calendar, CheckCircle, Clock, Send, Copy, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  const deleteLead = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setLeads(leads.filter(l => l.id !== deleteId));
      toast({
        title: "Заявка удалена",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
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
      description: `Код ${code} скопирован`,
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-14 bg-muted/30 backdrop-blur-sm py-2 -mx-2 px-2 sm:static sm:bg-transparent sm:py-0 z-10">
        <h2 className="text-xl sm:text-2xl font-bold">Заявки</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32 sm:w-40">
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
        <>
          {/* Mobile compact list */}
          <div className="sm:hidden space-y-2">
            {leads.map((lead) => (
              <div 
                key={lead.id}
                className="flex items-center gap-2 p-3 bg-background rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{lead.name}</span>
                    <Badge className={`${statusColors[lead.status || "new"]} shrink-0 text-[10px] px-1.5 py-0`}>
                      {statusLabels[lead.status || "new"]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{lead.phone}</span>
                    {lead.created_at && (
                      <>
                        <span>•</span>
                        <span>{format(new Date(lead.created_at), "d.MM.yy", { locale: ru })}</span>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateStatus(lead.id, "new")}>
                      <Clock className="h-3 w-3 mr-2" /> Новая
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(lead.id, "in_progress")}>
                      <Loader2 className="h-3 w-3 mr-2" /> В работе
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(lead.id, "completed")}>
                      <CheckCircle className="h-3 w-3 mr-2" /> Завершена
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(lead.id, "cancelled")}>
                      Отменена
                    </DropdownMenuItem>
                    {lead.status === "completed" && !lead.review_code && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => generateReviewCode(lead)}>
                          <Send className="h-3 w-3 mr-2" /> Код отзыва
                        </DropdownMenuItem>
                      </>
                    )}
                    {lead.review_code && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => copyCode(lead.review_code!)}>
                          <Copy className="h-3 w-3 mr-2" /> {lead.review_code}
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(lead.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" /> Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {/* Desktop cards */}
          <div className="hidden sm:grid gap-4">
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
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[lead.status || "new"]}>
                        {statusLabels[lead.status || "new"]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={() => setDeleteId(lead.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                            Код отзыва
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Заявка будет удалена из базы данных.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteLead}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
