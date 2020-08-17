import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '../store';

interface AxiosResponseSuccess<T = any> {
  message: string;
  data: T;
}

const defaultInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL,
  timeout: 60000,
});

class RestService {
  constructor(instance = defaultInstance) {
    this.axios = instance;
  }

  private axios: AxiosInstance;

  public get(request: AxiosRequestConfig): Promise<AxiosResponseSuccess> {
    return this.execute({
      method: 'get',
      ...request,
    });
  }

  public post(request: AxiosRequestConfig): Promise<AxiosResponseSuccess> {
    return this.execute({ method: 'post', ...request });
  }

  public put(request: AxiosRequestConfig): Promise<AxiosResponseSuccess> {
    return this.execute({ method: 'put', ...request });
  }

  public delete(request: AxiosRequestConfig): Promise<AxiosResponseSuccess> {
    return this.execute({ method: 'delete', ...request });
  }

  private async execute(request: AxiosRequestConfig) {
    store.commit('loading/setLoading', true);

    try {
      const response: AxiosResponse = await this.axios(request);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      store.commit('loading/setLoading', false);
    }
  }
}

export default RestService;
