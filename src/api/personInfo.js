import request from '@/utils/request'

// export function getPersonInfo(params, method) {
//   return request({
//     url: baseUrl + '/1615858749939',
//     params
//   })
// }

export function getPersonInfo(params, method) {
  return request({
    url: '/personInfo/get',
    params,
    method
  })
}

export function addPersonInfo(data, method) {
  return request({
    url: '/personInfo/add',
    data,
    method
  })
}

export function updatePersonInfo(data, method) {
  return request({
    url: '/personInfo/update',
    data,
    method
  })
}

export function deletePersonInfo(data, method) {
  return request({
    url: '/personInfo/delete',
    data,
    method
  })
}
