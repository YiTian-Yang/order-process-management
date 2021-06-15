const router = require('koa-router')()
const list = require('./user')
const db = require('../utils/db')
router.post('/login', async(ctx, next) => {
  const body = ctx.request.body
  const userId = body.username
  const userPassword = body.password
  try {
    const data = await db.query(`
        select 
            userPassword 
        from 
            baseuser 
        where 
            userId = '${userId}'`
    )
    const params = await db.query(`
        select 
            userName
        from 
            baseuser 
        where 
            userId = '${userId}'`
    )
    const type = await db.query(`
        select
            userType 
        from 
            baseuser
        where 
            userId = '${userId}'`
    )
    if (data[0].userPassword === userPassword) {
      // eslint-disable-next-line require-atomic-updates
      ctx.body = {
        code: 20000,
        msg: '请求成功',
        data: {
          token: 'admin-token',
          type: type,
          name: params
        }
      }
    } else {
      // eslint-disable-next-line require-atomic-updates
      ctx.body = {
        code: 20001,
        msg: '账号或密码不正确!'
      }
    }
  } catch (e) {
    console.log(e)
    // eslint-disable-next-line require-atomic-updates
    ctx.body = {
      code: 20001,
      msg: '账号或密码不正确!'
    }
  }
})

router.get('/getToken', async(ctx, next) => {
  ctx.body = {
    code: 20000,
    msg: '请求成功',
    data: {
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      introduction: 'I am a super administrator',
      name: 'Super Admin',
      roles: ['admin']
    }
  }
})

router.post('/logout', async(ctx, next) => {
  ctx.body = {
    code: 20000,
    msg: '请求成功'
  }
})

router.get('/personInfo/get', async(ctx, next) => {
  const userName = ctx.query.userName
  let pageIndex = ctx.query.pageIndex
  const pageSize = ctx.query.pageSize
  pageIndex = (pageIndex - 1) * pageSize
  const data = await db.query(`
    select 
        Id,
        userId, 
        userName, 
        userPhone, 
        userType, 
        userEmail, 
        userQqNum, 
        userDepart 
    from 
        baseuser 
    where 
        userName 
    like  
        '%${userName}%' 
    limit 
        ${pageIndex},${pageSize}`
  )
  const count = await db.query(`
    select 
        count(*) 
    from 
        baseuser 
    where 
        userName 
    like 
        '%${userName}%'`
  )
  // eslint-disable-next-line require-atomic-updates
  ctx.body = {
    code: 20000,
    data: data,
    count: count[0]['count(*)'],
    msg: '请求成功'
  }
})

router.post('/personInfo/add', async(ctx, next) => {
  const body = ctx.request.body
  try {
    const data = await db.query(`
        insert into 
            baseuser (userId, 
            userName, 
            userPhone, 
            userType, 
            userEmail, 
            userQqNum, 
            userDepart, 
            userPassword) 
        VALUES 
            ('${body.userId}', 
            '${body.userName}', 
            '${body.userPhone}', 
            '${body.userType}', 
            '${body.userEmail}',
            '${body.userQqNum}', 
            '${body.userDepart}', 
            '${body.userPassword}')`
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/personInfo/update', async(ctx, next) => {
  const body = ctx.request.body
  try {
    if (body.userPassword) {
      const data = await db.query(`
        update 
            baseuser 
        set 
            userName = '${body.userName}', 
            userType = '${body.userType}', 
            userEmail = '${body.userEmail}', 
            userPhone = '${body.userPhone}',
            userQqNum = '${body.userQqNum}',
            userDepart = '${body.userDepart}', 
            userPassword = '${body.userPassword}' 
        where 
        Id = ${body.Id} `
      )
    } else {
      const data = await db.query(`
        update 
            baseuser 
        set 
            userName = '${body.userName}', 
            userType = '${body.userType}', 
            userEmail = '${body.userEmail}', 
            userPhone = '${body.userPhone}', 
            userQqNum = '${body.userQqNum}', 
            userDepart = '${body.userDepart}'
        where 
            Id = ${body.Id}`
      )
    }
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/personInfo/delete', async(ctx, next) => {
  const body = ctx.request.body
  try {
    for (let i = 0; i < body.length; i++) {
      const data = await db.query(`
        delete from 
            baseuser 
        where 
        Id = ${body[i].Id}`
      )
    }
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.get('/library/get', async(ctx, next) => {
  const libraryName = ctx.query.libraryName
  let pageIndex = ctx.query.pageIndex
  const pageSize = ctx.query.pageSize
  pageIndex = (pageIndex - 1) * pageSize
  const data = await db.query(`
    select 
        * 
    from 
        library 
    where 
        libraryName like '%${libraryName}%' 
    limit 
        ${pageIndex},${pageSize}`
  )
  const count = await db.query(`select count(*) from library where libraryName like '%${libraryName}%'`)
  ctx.body = {
    code: 20000,
    data: data,
    count: count[0]['count(*)'],
    msg: '请求成功'
  }
})

router.post('/library/add', async(ctx, next) => {
  const body = ctx.request.body
  try {
    // eslint-disable-next-line no-unused-vars
    const data = await db.query(`
        insert into 
            library (libraryId, 
            libraryType, 
            libraryName, 
            libraryMethod, 
            libraryText, remark, 
            libraryTime, 
            libraryPerson) 
        VALUES 
        ('${body.libraryId}', 
        '${body.libraryType}', 
        '${body.libraryName}', 
        '${body.libraryMethod}', 
        '${body.libraryText}', 
        '${body.remark}', 
        '${body.libraryTime}', 
        '${body.libraryPerson}')`
    )
    // eslint-disable-next-line require-atomic-updates
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    // eslint-disable-next-line require-atomic-updates
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/library/update', async(ctx, next) => {
  const body = ctx.request.body
  try {
    const data = await db.query(`
        update 
            library 
        set 
            libraryText = '${body.libraryText}', 
            remark = '${body.remark}',
            libraryTime = '${body.libraryTime}',
            libraryPerson = '${body.libraryPerson}' 
        where 
            Id = ${body.Id} `
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/library/delete', async(ctx, next) => {
  const body = ctx.request.body
  try {
    for (let i = 0; i < body.length; i++) {
      const data = await db.query(`
        delete from 
            library 
        where 
            Id = ${body[i].Id}`)
    }
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.get('/order/get', async(ctx, next) => {
  const orderCustomer = ctx.query.orderCustomer
  const orderState = ctx.query.orderState
  const userType = ctx.query.userType
  let pageIndex = ctx.query.pageIndex
  const pageSize = ctx.query.pageSize
  pageIndex = (pageIndex - 1) * pageSize
  if (!(userType === '超级管理员' || userType === '销售')) {
    ctx.body = {
      code: 20002,
      msg: '该账号无权限查看该页面'
    }
    return
  }
  const data = await db.query(`
    select 
        * 
    from 
        ordermanagement 
    where 
        orderCustomer like '%${orderCustomer}%' and orderState like '%${orderState}%'
    limit 
        ${pageIndex},${pageSize}`
  )
  const count = await db.query(`
    select 
        count(*) 
    from 
        ordermanagement 
    where  
        orderCustomer like '%${orderCustomer}%' and orderState like '%${orderState}%'`
  )
  ctx.body = {
    code: 20000,
    data: data,
    count: count[0]['count(*)'],
    msg: '请求成功'
  }
})

router.post('/order/add', async(ctx, next) => {
  const body = ctx.request.body
  const orderMethod = await db.query(`
    select 
        libraryMethod 
    from 
        library 
    where 
        libraryName = '${body.orderName}'`)
  console.log(orderMethod[0].libraryMethod)
  try {
    const data = await db.query(`
    insert into 
        ordermanagement (orderStartTime, 
        orderEndTime, 
        orderPerson, 
        orderCustomer, 
        orderCustomerPhone, 
        remark, 
        orderText, 
        orderName, 
        orderMethod, 
        orderState) 
     VALUES (
        '${body.orderStartTime}', 
        '${body.orderEndTime}', 
        '${body.orderPerson}', 
        '${body.orderCustomer}', 
        '${body.orderCustomerPhone}', 
        '${body.remark}', 
        '${body.orderText}', 
        '${body.orderName}', 
        '${orderMethod[0].libraryMethod}', 
        '${body.orderState}')`
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/order/update', async(ctx, next) => {
  const body = ctx.request.body
  const orderMethod = await db.query(`select libraryMethod from library where libraryName = '${body.orderName}'`)
  console.log(orderMethod[0].libraryMethod)
  try {
    const data = await db.query(`
        update 
            ordermanagement
        set 
            orderStartTime = '${body.orderStartTime}', 
            orderEndTime = '${body.orderEndTime}',
            orderPerson = '${body.orderPerson}',
            orderCustomer = '${body.orderCustomer}',
            orderCustomerPhone = '${body.orderCustomerPhone}',
            remark = '${body.remark}',
            orderText = '${body.orderText}',
            orderName = '${body.orderName}', 
            orderMethod = '${orderMethod[0].libraryMethod}', 
            orderState = '${body.orderState}'
        where 
            Id = ${body.Id} `
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/order/delete', async(ctx, next) => {
  const body = ctx.request.body
  try {
    for (let i = 0; i < body.length; i++) {
      // eslint-disable-next-line no-unused-vars
      const data = await db.query(`
        delete from 
            ordermanagement
        where 
            Id = ${body[i].Id}`)
      // eslint-disable-next-line no-unused-vars
      const data2 = await db.query(`
        delete from 
            taskmanagement
        where 
            taskId = ${body[i].Id}`)
    }
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.get('/taskDecomposition/get/person', async(ctx, next) => {
  const data = await db.query(`
    select 
        userName
    from 
        baseuser
    where 
        userType = '检测员'`
  )
  ctx.body = {
    code: 20000,
    data: data,
    msg: '请求成功'
  }
})

router.get('/taskDecomposition/get', async(ctx, next) => {
  const orderCustomer = ctx.query.orderCustomer
  let pageIndex = ctx.query.pageIndex
  const pageSize = ctx.query.pageSize
  pageIndex = (pageIndex - 1) * pageSize
  const data = await db.query(`
    select 
        * 
    from 
        ordermanagement 
    where 
        orderCustomer like '%${orderCustomer}%' and ( orderState = 1 or orderState = 2 or orderState = 3 ) 
    limit 
        ${pageIndex},${pageSize}`
  )
  const count = await db.query(`
    select 
        count(*) 
    from 
        ordermanagement 
    where  
        orderCustomer like '%${orderCustomer}%' and ( orderState = 1 or orderState = 2 or orderState = 3 )`
  )
  ctx.body = {
    code: 20000,
    data: data,
    count: count[0]['count(*)'],
    msg: '请求成功'
  }
})

router.post('/taskDecomposition/update', async(ctx, next) => {
  const body = ctx.request.body
  try {
    const data = await db.query(`
        update 
            ordermanagement
        set 
            orderState = 2
        where 
            Id = ${body.Id} `
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/taskDecomposition/add', async(ctx, next) => {
  const body = ctx.request.body
  try {
    const data = await db.query(`
    insert into
        taskmanagement (taskId,
        taskStartTime,
        taskEndTime,
        taskChairman,
        taskPerson,
        taskName,
        taskMethod,
        taskText,
        remark,
        taskState)
     VALUES (
        '${body.taskId}',
        '${body.taskStartTime}',
        '${body.taskEndTime}',
        '${body.taskChairman}',
        '${body.taskPerson}',
        '${body.taskMethod}',
        '${body.taskName}',
        '${body.taskText}',
        '${body.remark}',
        '1')`
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    const data = await db.query(`
        update 
            taskmanagement
        set 
            taskChairman = '${body.taskChairman}',
            taskPerson = '${body.taskPerson}',
            taskText = '${body.taskText}',
            remark = '${body.remark}',
            taskState = 1
        where 
            taskId = ${body.taskId} `
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  }
})

router.get('/detectionResult/get', async(ctx, next) => {
  const userType = ctx.query.userType
  const userName = ctx.query.userName
  let pageIndex = ctx.query.pageIndex
  const pageSize = ctx.query.pageSize
  pageIndex = (pageIndex - 1) * pageSize
  try {
    if (userType === '检测员') {
      const data = await db.query(`
        select 
            * 
        from 
            taskmanagement
        where 
            taskPerson = '${userName}' and (taskState = 1 or taskState = 2)
        limit 
            ${pageIndex},${pageSize}`
      )
      const count = await db.query(`
        select 
            count(*) 
        from 
            taskmanagement
        where  
            taskPerson = '${userName}' and (taskState = 1 or taskState = 2)`
      )
      ctx.body = {
        code: 20000,
        data: data,
        count: count[0]['count(*)'],
        msg: '请求成功'
      }
    } else if (userType === '技术主管' || userType === '超级管理员') {
      const data = await db.query(`
        select 
            * 
        from 
            taskmanagement
        where
            taskState = 1 or taskState = 2
        limit 
            ${pageIndex},${pageSize}`
      )
      const count = await db.query(`
        select 
            count(*) 
        from 
            taskmanagement
        where
            taskState = 1 or taskState = 2`
      )
      ctx.body = {
        code: 20000,
        data: data,
        count: count[0]['count(*)'],
        msg: '请求成功'
      }
    } else {
      ctx.body = {
        code: 20002,
        msg: '该账号无权限查看该页面'
      }
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20002,
      msg: '该账号无权限查看该页面'
    }
  }
})

router.post('/detectionResult/update', async(ctx, next) => {
  const body = ctx.request.body
  try {
    const data = await db.query(`
        update 
            ordermanagement
        set 
            orderState = 3
        where 
            Id = ${body.taskId} `
    )
    const data2 = await db.query(`
      update
          taskmanagement
      set 
          taskState = 2,
          taskPerson = '${body.taskPerson}',
          taskResult = '${body.taskResult}',
          remark = '${body.remark}',
          taskText = '${body.taskText}'
      where
          Id = ${body.Id}`
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.post('/reportSubmission/update', async(ctx, next) => {
  const body = ctx.request.body
  console.log(body)
  try {
    const data = await db.query(`
        update 
            ordermanagement
        set 
            orderState = '${body.orderState}'
        where 
            Id = ${body.taskId} `
    )
    const data2 = await db.query(`
      update
          taskmanagement
      set 
          taskState = '${body.taskState}'
      where
          Id = ${body.Id}`
    )
    ctx.body = {
      code: 20000,
      msg: '请求成功'
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 20001,
      msg: '错误，请联系管理员或查看操作手册！'
    }
  }
})

router.get('/test/get', async(ctx, next) => {
  const list = []
  const data = {
    name: '张三',
    phone: '15921798831',
    region: 'china',
    email: '842819868@qq.com',
    sex: '男',
    height: '178cm',
    weight: '80kg',
    qqNum: '842819868'
  }
  const data2 = {
    name: '李四！！',
    phone: '15921798831',
    region: 'china',
    email: '842819868@qq.com',
    sex: '男',
    height: '178cm',
    weight: '80kg',
    qqNum: '842819868'
  }
  const data3 = {
    name: '王五！！',
    phone: '15921798831',
    region: 'china',
    email: '842819868@qq.com',
    sex: '男',
    height: '178cm',
    weight: '80kg',
    qqNum: '842819868'
  }
  for (let i = 0; i < 10000; i++) {
    list.push(data)
    list.push(data3)
    list.push(data2)
  }
  ctx.body = {
    code: 10000,
    data: list,
    msg: '请求成功',
    count: 30000
  }
})

router.use('/list', list.routes(), list.allowedMethods())
module.exports = router

