// if NOT production mode => use .env to set environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../../models/record')
const User = require('../../models/user')
const Category = require('../../models/category')
const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: '廣志',
    account: 'user1@example.com',
    password: '12345678'
  },
  {
    name: '小新',
    account: 'user2@example.com',
    password: '12345678'
  }
]

const SEED_RECORD = [
  {
    name: '午餐',
    date: new Date('2019-04-23').toISOString(),
    formattedDate: '2019/04/23',
    amount: 60,
    category: 'food',
    userName: '廣志'
  },
  {
    name: '晚餐',
    date: new Date('2019-04-23').toISOString(),
    formattedDate: '2019/04/23',
    amount: 60,
    category: 'food',
    userName: '廣志'
  },
  {
    name: '捷運',
    date: new Date('2019-04-23').toISOString(),
    formattedDate: '2019/04/23',
    amount: 120,
    category: 'transport',
    userName: '廣志'
  },
  {
    name: '電影：驚奇隊長',
    date: new Date('2019-04-23').toISOString(),
    formattedDate: '2019/04/23',
    amount: 220,
    category: 'recreation',
    userName: '小新'
  },
  {
    name: '租金',
    date: new Date('2015-04-01').toISOString(),
    formattedDate: '2015/04/01',
    amount: 25000,
    category: 'home',
    userName: '廣志'
  },
]

db.once('open', async () => {
  try {
    for (const user of SEED_USER) {
      const salt = await bcrypt.genSalt(10) // saltRounds = 10
      const hash = await bcrypt.hash(user.password, salt)
      await User.create({
        ...user,
        password: hash, // use hash replace password
        totalAmount: 0,
        categoryAmount: [0, 0, 0, 0, 0]
      })
    }

    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category

    for (const record of SEED_RECORD) {
      const cat = await Category.findOne({ name_en: record.category })
      const user = await User.findOne({ name: record.userName })
      const { name, date, formattedDate, amount } = record
      await Record.create({ name, date, formattedDate, amount, userId: user._id, categoryId: cat._id })

      user.categoryAmount[allCat.findIndex(e => e.id === cat.id)
      ] += Number(amount)
      user.totalAmount += Number(amount)
      await user.save()
    }
    process.exit()
  } catch (error) {
    return console.error(error)
  }
})
