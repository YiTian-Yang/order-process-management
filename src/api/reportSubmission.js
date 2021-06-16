import request from '@/utils/request'

export function updateOrderInfo(data, method) {
  return request({
    url: '/reportSubmission/update',
    data,
    method
  })
}
