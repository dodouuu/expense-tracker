// if NOT production mode => use .env to set environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../../models/record')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')

const SEED_USER_1 = {
  email: 'user1@example.com',
  password: '12345678'
}
const SEED_USER_2 = {
  email: 'user2@example.com',
  password: '12345678'
}

db.once('open', async () => {
  try {
    console.log('start recordSeeder')
    let salt = await bcrypt.genSalt(10) // saltRounds = 10
    let hash = await bcrypt.hash(SEED_USER_1.password, salt)

    // gen id = userNumber + 1
    let userNumber = await User.find({}).countDocuments()
    const newUser = await User.create({
      id: userNumber + 1,
      name: '廣志',
      account: SEED_USER_1.email,
      password: hash, // use hash replace password
      totalAmount: 0,
      categoryAmount: [0, 0, 0, 0, 0]
    })

    salt = await bcrypt.genSalt(10) // saltRounds = 10
    hash = await bcrypt.hash(SEED_USER_2.password, salt)
    userNumber++
    const newUser2 = await User.create({
      id: userNumber + 1,
      name: '小新',
      account: SEED_USER_2.email,
      password: hash, // use hash replace password
      totalAmount: 0,
      categoryAmount: [0, 0, 0, 0, 0]
    })

    // transform dateStr to date.toISOString()
    let dateStr = '2019-04-23'
    let date = new Date(dateStr)
    let iso = date.toISOString()
    let formattedDate = '2019/04/23'

    // get Max Record id
    const userId = newUser.id
    const maxRecord = await Record.find({ userId }).sort({ id: -1 }).limit(1)
    let maxId = maxRecord.map(u => u.id)

    maxId++
    await Record.create({ id: maxId, name: '午餐', date: iso, formattedDate, amount: 60, userId, user_id: newUser._id, categoryId: 4 })
    // update categoryAmount and totalAmount
    newUser.categoryAmount[3] += Number(60)
    newUser.totalAmount += Number(60)
    await newUser.save()

    maxId++
    await Record.create({ id: maxId, name: '晚餐', date: iso, formattedDate, amount: 60, userId, user_id: newUser._id, categoryId: 4 })
    // update categoryAmount and totalAmount
    newUser.categoryAmount[3] += Number(60)
    newUser.totalAmount += Number(60)
    await newUser.save()

    maxId++
    await Record.create({ id: maxId, name: '捷運', date: iso, formattedDate, amount: 120, userId, user_id: newUser._id, categoryId: 2 })
    // update categoryAmount and totalAmount
    newUser.categoryAmount[1] += Number(120)
    newUser.totalAmount += Number(120)
    await newUser.save()

    maxId++
    await Record.create({ id: maxId, name: '電影：驚奇隊長', date: iso, formattedDate, amount: 220, userId: newUser2.id, user_id: newUser2._id, categoryId: 3 })
    // update categoryAmount and totalAmount
    newUser2.categoryAmount[2] += Number(220)
    newUser2.totalAmount += Number(220)
    await newUser2.save()

    maxId++
    // transform dateStr to date.toISOString()
    dateStr = '2015-04-01'
    date = new Date(dateStr)
    iso = date.toISOString()
    formattedDate = '2015-04-01'
    await Record.create({ id: maxId, name: '租金', date: iso, formattedDate, amount: 25000, userId, user_id: newUser._id, categoryId: 1 })
    // update categoryAmount and totalAmount
    newUser.categoryAmount[0] += Number(25000)
    newUser.totalAmount += Number(25000)
    await newUser.save()

    console.log('end recordSeeder')
    process.exit()
  } catch (error) {
    return console.error(error)
  }

})
