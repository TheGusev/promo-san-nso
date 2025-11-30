import { supabase } from "@/integrations/supabase/client";

interface QueuedLead {
  data: any;
  queued_at: number;
}

const QUEUE_KEY = 'lead_queue';

export const queueLead = (leadData: any) => {
  try {
    const queue = getQueue();
    queue.push({ data: leadData, queued_at: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('[Offline Queue] Lead queued:', leadData);
  } catch (error) {
    console.error('[Offline Queue] Failed to queue lead:', error);
  }
};

export const getQueue = (): QueuedLead[] => {
  try {
    const queueStr = localStorage.getItem(QUEUE_KEY);
    return queueStr ? JSON.parse(queueStr) : [];
  } catch {
    return [];
  }
};

export const clearQueue = () => {
  localStorage.removeItem(QUEUE_KEY);
};

export const processQueue = async (): Promise<{ success: number; failed: number }> => {
  const queue = getQueue();
  if (queue.length === 0) {
    return { success: 0, failed: 0 };
  }

  console.log(`[Offline Queue] Processing ${queue.length} queued leads...`);
  
  let successCount = 0;
  let failedCount = 0;
  const remainingQueue: QueuedLead[] = [];

  for (const item of queue) {
    try {
      const { error } = await supabase.functions.invoke('handle-lead', {
        body: item.data
      });

      if (error) throw error;
      
      successCount++;
      console.log('[Offline Queue] Successfully submitted queued lead');
    } catch (error) {
      console.error('[Offline Queue] Failed to submit queued lead:', error);
      failedCount++;
      // Keep failed items in queue for retry
      remainingQueue.push(item);
    }
  }

  // Update queue with only failed items
  if (remainingQueue.length > 0) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
  } else {
    clearQueue();
  }

  console.log(`[Offline Queue] Processed: ${successCount} success, ${failedCount} failed`);
  return { success: successCount, failed: failedCount };
};
