import request from '@/utils/request'

export function getLibraryInfo(params, method) {
  return request({
    url: '/library/get',
    params,
    method
  })
}

export function addLibraryInfo(data, method) {
  return request({
    url: '/library/add',
    data,
    method
  })
}

export function updateLibraryInfo(data, method) {
  return request({
    url: '/library/update',
    data,
    method
  })
}

export function deleteLibraryInfo(data, method) {
  return request({
    url: '/library/delete',
    data,
    method
  })
}
