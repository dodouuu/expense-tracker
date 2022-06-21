const express = require('express')
const router = express.Router()
// import Record model
const Record = require('../../models/record')

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

  // const userId = req.user._id
  // Restaurant.find({ userId })
  //   .lean()
  //   .sort({ _id: 'asc' }) // 根據 _id ascending sort
  //   .then(restaurants => res.render('index', { restaurants }))
  //   .catch(error => console.error(error))
})

// 排序功能
router.get('/sort', (req, res) => {
  const sortBy = req.query.sortBy // 來自 index.hbs <select name="sortBy"
  const userId = req.user._id
  if (sortBy === 'az') {
    Restaurant.find({ userId })
      .lean()
      .sort({ name_en_insensitive: 'asc' }) // 根據 name_en ascending sort 不分大小寫
      .then(restaurants => res.render('index', { restaurants, sortAZ: true }))
      .catch(error => console.error(error))
  } else if (sortBy === 'za') {
    Restaurant.find({ userId })
      .lean()
      .sort({ name_en_insensitive: 'desc' }) // 根據 name_en descending sort 不分大小寫
      .then(restaurants => res.render('index', { restaurants, sortZA: true }))
      .catch(error => console.error(error))
  } else if (sortBy === 'category') {
    Restaurant.find({ userId })
      .lean()
      .sort({ category_insensitive: 'asc' }) // 根據 category ascending sort 不分大小寫
      .then(restaurants => res.render('index', { restaurants, sortCat: true }))
      .catch(error => console.error(error))
  } else if (sortBy === 'location') {
    Restaurant.find({ userId })
      .lean()
      .sort({ location_insensitive: 'asc' }) // 根據 location ascending sort 不分大小寫
      .then(restaurants => res.render('index', { restaurants, sortLoc: true }))
      .catch(error => console.error(error))
  }
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  const originalKeyword = req.query.keyword.trim()
  const userId = req.user._id
  Restaurant.find({
    $and: [
      { userId },
      {
        $or: [
          { name: { $regex: originalKeyword, $options: 'si' } },
          { category: { $regex: originalKeyword, $options: 'si' } }
        ]
      }
    ]
  })
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants, keywords: originalKeyword })
    })
    .catch(error => console.error(error))
})

module.exports = router
