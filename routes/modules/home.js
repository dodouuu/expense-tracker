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
    const allCat = await Category.find().lean()
    records.map(record => {
      record.fontawesomeStr = allCat[record.categoryId - 1].fontawesomeStr
    })

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

    let selectedCategory = ''
    const cat = await Category.findOne({ name_en: req.params.category }).lean()
    const allCat = await Category.find().lean()

    if (cat === null) { // user choose all
      selectedCategory = '全部類別'
      const records = await Record.find({ userId }).lean()
      records.map(record => {
        record.fontawesomeStr = allCat[record.categoryId - 1].fontawesomeStr
      })
      return res.render('index', {
        records,
        totalAmount: user.totalAmount,
        selectedCategory
      })
    } else {
      selectedCategory = cat.name
    }
    const filter = { categoryId: cat.id, userId }
    const records = await Record.find(filter).lean()
    records.map(record => {
      record.fontawesomeStr = allCat[record.categoryId - 1].fontawesomeStr
    })
    return res.render('index', {
      records,
      totalAmount: user.categoryAmount[cat.id - 1],
      selectedCategory
    })
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router
