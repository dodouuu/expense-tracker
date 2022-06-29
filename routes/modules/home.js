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
    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category
    records.map(record => {
      record.fontawesomeStr = allCat.find(element => element.id === record.categoryId).fontawesomeStr
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
    const viewCat = await Category.findOne({ name_en: req.params.category }).lean() // category user want to view
    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category

    if (viewCat === null) { // user choose all
      selectedCategory = '全部類別'
      const records = await Record.find({ userId }).lean()
      records.map(record => {
        record.fontawesomeStr = allCat.find(element => element.id === record.categoryId).fontawesomeStr
      })
      return res.render('index', {
        records,
        totalAmount: user.totalAmount,
        selectedCategory
      })
    } else {
      selectedCategory = viewCat.name
    }
    const filter = { categoryId: viewCat.id, userId }
    const records = await Record.find(filter).lean()
    records.map(record => {
      record.fontawesomeStr = allCat.find(element => element.id === record.categoryId).fontawesomeStr
    })
    return res.render('index', {
      records,
      totalAmount: user.categoryAmount[allCat.findIndex(e => e.id === viewCat.id)],
      selectedCategory
    })
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router
