import request from '@/utils/request'

export function getPersonInfo(params, method) {
  return request({
    url: '/taskDecomposition/get/person',
    params,
    method
  })
}

export function getOrderInfo(params, method) {
  return request({
    url: '/taskDecomposition/get',
    params,
    method
  })
}

export function taskDecomposition(data, method) {
  return request({
    url: '/taskDecomposition/add',
    data,
    method
  })
}
export function updateOrder(data, method) {
  return request({
    url: '/taskDecomposition/update',
    data,
    method
  })
}

