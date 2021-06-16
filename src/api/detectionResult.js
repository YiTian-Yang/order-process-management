import request from '@/utils/request'

export function getTaskInfo(params, method) {
  return request({
    url: '/detectionResult/get',
    params,
    method
  })
}

export function updateOrderInfo(data, method) {
  return request({
    url: '/detectionResult/update',
    data,
    method
  })
}

// export function updateTaskInfo(data, method) {
//   return request({
//     url: baseurl + '/update/task',
//     data,
//     method
//   })
// }

