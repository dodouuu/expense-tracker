const express = require('express')
const router = express.Router()
// import Record model
const Record = require('../../models/record')
// const moment = require('moment')
const User = require('../../models/user')

// go to home page views/index.hbs
router.get('/', async (req, res) => {

  try {
    const totalAmount = req.user.totalAmount
    const userId = req.user.id
    // console.log('tta=', totalAmount)
    const records = await Record.find({ userId }).lean()
    // console.log('records array=', records)

    return res.render('index', { records, totalAmount })
  } catch (error) {
    return console.error(error)
  }
})

// individual category expenses
router.get('/:category', async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findOne({ id: userId })

    const record_category = req.params.category
    let record_categoryId = -1
    let selectedCategory = ''
    if (record_category === 'home') {
      record_categoryId = 0
      selectedCategory = '家居物業'
    } else if (record_category === 'transport') {
      record_categoryId = 1
      selectedCategory = '交通出行'
    } else if (record_category === 'recreation') {
      record_categoryId = 2
      selectedCategory = '休閒娛樂'
    } else if (record_category === 'food') {
      record_categoryId = 3
      selectedCategory = '餐飲食品'
    } else if (record_category === 'other') {
      record_categoryId = 4
      selectedCategory = '其他'
    } else if (record_category === 'all') {
      selectedCategory = '全部類別'
      const records = await Record.find({ userId }).lean()
      return res.render('index', {
        records,
        totalAmount: user.totalAmount,
        selectedCategory
      })
    }

    const filter = { categoryId: record_categoryId + 1, userId }
    const records = await Record.find(filter).lean()
    return res.render('index', {
      records,
      totalAmount: user.categoryAmount[record_categoryId],
      selectedCategory
    })
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router
