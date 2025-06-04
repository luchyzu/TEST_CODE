import { request } from 'umi';
import { API_PREFIX, PROXY_API_PATH } from './constants';

/** 测试请求 */
export async function test(body?: Record<string, any>, options?: Record<string, any>) {
  return request<API.Response>(`${PROXY_API_PATH}${API_PREFIX}/query`, {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}
