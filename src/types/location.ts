export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province_id: number;
}

export interface District {
  id: number;
  name: string;
}

export interface ProvincesResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Province[];
}

export interface CitiesResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: City[];
}

export interface DistrictsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: District[];
}
