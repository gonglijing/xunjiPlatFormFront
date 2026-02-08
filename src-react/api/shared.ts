export type ApiId = number | string;
export type ApiIds = ApiId | ApiId[];
export type ApiParams = Record<string, unknown>;
export type ApiPayload = ApiParams | FormData;

export function toArrayIds(value: ApiIds | null | undefined): ApiId[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [value];
}

export function withId(id: ApiId, key = 'id'): ApiParams {
  return { [key]: id };
}

export function withIds(ids: ApiIds | null | undefined, key = 'ids'): ApiParams {
  return { [key]: toArrayIds(ids) };
}
