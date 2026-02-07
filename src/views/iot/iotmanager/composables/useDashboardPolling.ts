import { onUnmounted } from 'vue';

export function useDashboardPolling(isActive: { value: boolean }) {
  const timers: ReturnType<typeof setTimeout>[] = [];

  function pollOnce(fn: () => Promise<any>, delay: number) {
    fn().finally(() => {
      if (isActive.value) {
        const timer = setTimeout(() => pollOnce(fn, delay), delay);
        timers.push(timer);
      }
    });
  }

  function startPolling(fn: () => Promise<any>, delay = 3000) {
    pollOnce(fn, delay);
  }

  onUnmounted(() => {
    timers.forEach(clearTimeout);
  });

  return { startPolling };
}
