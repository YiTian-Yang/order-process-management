const mysql = require('mysql')

const pool = mysql.createPool({
  host: '42.192.120.26',
  port: 3306,
  database: 'ordermanagement',
  user: 'root',
  password: '980904yyt'
})
const query = function(sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}
exports.query = query
