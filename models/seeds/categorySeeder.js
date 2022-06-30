// if NOT production mode => use .env to set environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Category = require('../category')

const CATEGORY =
  [
    {
      name: '家居物業',
      name_en: 'home',
      id: 1,
      fontawesomeStr: 'fa-solid fa-house'
    },
    {
      name: '交通出行',
      name_en: 'transport',
      id: 2,
      fontawesomeStr: 'fa-solid fa-van-shuttle'
    },
    {
      name: '休閒娛樂',
      name_en: 'recreation',
      id: 3,
      fontawesomeStr: 'fa-solid fa-face-grin-beam'
    },
    {
      name: '餐飲食品',
      name_en: 'food',
      id: 4,
      fontawesomeStr: 'fa-solid fa-utensils'
    },
    {
      name: '其他',
      name_en: 'other',
      id: 5,
      fontawesomeStr: 'fa-solid fa-pen'
    }
  ]

db.once('open', async () => {
  try {
    for (let i = 0; i < 5; i++) {
      await Category.create({
        id: CATEGORY[i].id,
        name: CATEGORY[i].name,
        name_en: CATEGORY[i].name_en,
        fontawesomeStr: CATEGORY[i].fontawesomeStr
      })
    }
    process.exit()
  } catch (error) {
    return console.error(error)
  }
})