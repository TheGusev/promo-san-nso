import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, Check, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Review = {
  id: string;
  display_name: string;
  rating: number;
  text: string;
  object_type: string | null;
  is_approved: boolean;
  is_rejected: boolean;
  created_at: string;
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [tab]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (tab === "pending") {
        query = query.eq("is_approved", false).eq("is_rejected", false);
      } else if (tab === "approved") {
        query = query.eq("is_approved", true);
      } else if (tab === "rejected") {
        query = query.eq("is_rejected", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
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

  const moderateReview = async (reviewId: string, approve: boolean) => {
    setProcessing(reviewId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("reviews")
        .update({
          is_approved: approve,
          is_rejected: !approve,
          approved_at: approve ? new Date().toISOString() : null,
          approved_by: approve ? user?.id : null,
        })
        .eq("id", reviewId);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== reviewId));

      toast({
        title: approve ? "Отзыв одобрен" : "Отзыв отклонён",
        description: approve 
          ? "Отзыв опубликован на сайте" 
          : "Отзыв скрыт от публикации",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    setProcessing(reviewId);
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== reviewId));

      toast({
        title: "Отзыв удалён",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Модерация отзывов</h2>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">На модерации</TabsTrigger>
          <TabsTrigger value="approved">Одобренные</TabsTrigger>
          <TabsTrigger value="rejected">Отклонённые</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {tab === "pending" && "Нет отзывов на модерации"}
                {tab === "approved" && "Нет одобренных отзывов"}
                {tab === "rejected" && "Нет отклонённых отзывов"}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{review.display_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(review.created_at), "d MMM yyyy", { locale: ru })}
                          </span>
                        </div>
                      </div>
                      {review.object_type && (
                        <Badge variant="secondary">{review.object_type}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{review.text}</p>

                    <div className="flex gap-2">
                      {tab === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => moderateReview(review.id, true)}
                            disabled={processing === review.id}
                          >
                            {processing === review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Одобрить
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moderateReview(review.id, false)}
                            disabled={processing === review.id}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Отклонить
                          </Button>
                        </>
                      )}
                      {tab === "rejected" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => moderateReview(review.id, true)}
                            disabled={processing === review.id}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Одобрить
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteReview(review.id)}
                            disabled={processing === review.id}
                          >
                            Удалить
                          </Button>
                        </>
                      )}
                      {tab === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderateReview(review.id, false)}
                          disabled={processing === review.id}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Скрыть
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
