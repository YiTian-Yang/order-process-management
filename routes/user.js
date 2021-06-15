const router = require('koa-router')
const list = new router()

list.get('/test',async (ctx) => {
  ctx.body = 'test'
})

module.exports = list
