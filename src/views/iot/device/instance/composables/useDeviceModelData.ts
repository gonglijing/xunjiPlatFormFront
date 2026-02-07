import { ref, Ref } from 'vue';
import api from '/@/api/device';

type ModelType = 'attr' | 'fun' | 'event' | 'tab';

const apiMap: Record<ModelType, (params: object) => Promise<any>> = {
  attr: api.model.property,
  fun: api.model.function,
  event: api.model.event,
  tab: api.model.tag,
};

export function useDeviceModelData(
  tableData: Ref<{ data: any[]; total: number; param: any }>,
  tableLoading: Ref<boolean>
) {
  function fetchModelData(type: ModelType) {
    const apiFn = apiMap[type];
    if (!apiFn) return;
    tableData.value.data = [];
    tableLoading.value = true;
    apiFn(tableData.value.param)
      .then((res: any) => {
        tableData.value.data = res.Data;
        tableData.value.total = res.Total;
      })
      .finally(() => {
        tableLoading.value = false;
      });
  }

  return { fetchModelData };
}
