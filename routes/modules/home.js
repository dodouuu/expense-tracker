const express = require('express')
const router = express.Router()
// import Record model
const Record = require('../../models/record')
// const moment = require('moment')
const User = require('../../models/user')
const Category = require('../../models/category')

// go to home page views/index.hbs
router.get('/', async (req, res) => {

  try {
    const totalAmount = req.user.totalAmount
    const userId = req.user.id
    const records = await Record.find({ userId }).lean()

    return res.render('index', { records, totalAmount })
  } catch (error) {
    return console.error(error)
  }
})

// individual category expenses
router.get('/:category', async (req, res) => {
  if (req.params.category === 'favicon.ico') return
  try {
    const userId = req.user.id
    const user = await User.findOne({ id: userId })

    const record_category = req.params.category
    let record_categoryId = -1
    let selectedCategory = ''
    const cat = await Category.findOne({ name_en: record_category }).lean()

    if (cat === null) { // user choose all
      selectedCategory = '全部類別'
      const records = await Record.find({ userId }).lean()
      return res.render('index', {
        records,
        totalAmount: user.totalAmount,
        selectedCategory
      })
    } else {
      record_categoryId = cat.id - 1
      selectedCategory = cat.name
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
