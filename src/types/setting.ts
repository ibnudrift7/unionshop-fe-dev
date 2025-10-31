export interface ApiSettingItem {
  id: number;
  name: string;
  label: string;
  value: string;
  type: string;
  group: string;
  dual_language: string; // 'y' | 'n' or other string values
  sort: number;
}

export interface ApiSettingsGrouped {
  default_meta: ApiSettingItem[];
  google_tools: ApiSettingItem[];
  settings: ApiSettingItem[];
}

export interface SettingsPayload {
  settings: ApiSettingsGrouped;
  flat: ApiSettingItem[];
}

export interface SettingsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: SettingsPayload;
}

export type SettingsMap = Record<string, ApiSettingItem>;
