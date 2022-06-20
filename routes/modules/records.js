const express = require('express')
const router = express.Router()
// import Record model
const Record = require('../../models/record')

// 新增餐廳頁面的路由
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳的動作
router.post('/', (req, res) => {
  // const userId = req.user._id
  const userId = req.user.id

  const { name } = req.body
  Record.create({ name, userId })

    // const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
    // 從 req.body 拿出餐廳各項資料

    // name_en_insensitive = name_en.toLowerCase()
    // category_insensitive = category.toLowerCase()
    // location_insensitive = location.toLowerCase()

    // Record.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId, name_en_insensitive, category_insensitive, location_insensitive })

    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router
