const db = require('./db')

const arr = [
  { userId: 'yanglement10', userName: '123' ,userPassword:'123456', userType:'超级管理员'},
  { userId: 'yanglement11', userName: '123' ,userPassword:'123456', userType:'超级管理员'},
  { userId: 'yanglement12', userName: '123' ,userPassword:'123456', userType:'超级管理员'}]

arr.map(val => {
  const sql = `select * from user`
  db.query(sql, (err, data) => {
    if(err) throw err
    console.log(data)
  })
})
