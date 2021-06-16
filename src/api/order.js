import request from '@/utils/request'

export function getOrderInfo(params, method) {
  return request({
    url: '/order/get',
    params,
    method
  })
}

export function addOrderInfo(data, method) {
  return request({
    url: '/order/add',
    data,
    method
  })
}

export function updateOrderInfo(data, method) {
  return request({
    url: '/order/update',
    data,
    method
  })
}

export function deleteOrderInfo(data, method) {
  return request({
    url: '/order/delete',
    data,
    method
  })
}
