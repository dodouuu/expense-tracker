const express = require('express')
const { populate } = require('../../models/record')
const router = express.Router()
// import Record model
const Record = require('../../models/record')
const moment = require('moment')
const User = require('../../models/user')
const Category = require('../../models/category')

// two functions for <input type="date" default value = today
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function getToday() {
  const today = new Date()
  return [
    today.getFullYear(),
    padTo2Digits(today.getMonth() + 1),
    padTo2Digits(today.getDate()),
  ].join('-')
}

// go to views/new.hbs
router.get('/new', (req, res) => {
  const today = getToday()
  return res.render('new', { today })
})

// Create a New expense
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id

    const { name, date, categoryId, amount } = req.body
    const formattedDate = moment(date).format('YYYY/MM/DD')

    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category
    const newCat = await Category.findOne({ id: categoryId })

    await Record.create({ name, date, formattedDate, amount, userId, categoryId: newCat._id })

    // update categoryAmount and totalAmount
    const user = await User.findOne({ _id: userId })
    user.categoryAmount[allCat.findIndex(e => e._id.equals(newCat._id))] += Number(amount)
    user.totalAmount += Number(amount)
    await user.save()

    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

// go to edit.hbs of an expense
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const record_id = req.params.id
    const record = await Record.findOne({ _id: record_id, userId }).lean()
    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category
    record.categoryId = allCat.find(e => e._id.equals(record.categoryId)).id
    const recordDate = moment(record.date).format('YYYY-MM-DD')
    return res.render('edit', { record, recordDate })
  } catch (error) {
    return console.error(error)
  }
})

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const record_id = req.params.id
    const filter = { _id: record_id, userId }
    const newRecord = { ...req.body }
    newRecord.formattedDate = moment(req.body.date).format('YYYY/MM/DD')
    newRecord.amount = Number(newRecord.amount)

    // update totalAmount and categoryAmount of User model
    const oldRecord = await Record.findOne(filter)
    // if dont use Number(), error will occur when update negative number
    const diffAmount = newRecord.amount - oldRecord.amount

    // sometimes, user just change categoryId but not amount
    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category

    const oldCatId = oldRecord.categoryId
    const newCatId = allCat.find(e => e.id === Number(newRecord.categoryId))._id
    newRecord.categoryId = newCatId
    const user = await User.findOne({ _id: userId })

    if (!oldCatId.equals(newCatId)) {
      user.categoryAmount[allCat.findIndex(e => e._id.equals(oldCatId))] -= oldRecord.amount
      user.categoryAmount[allCat.findIndex(e => e._id.equals(newCatId))] += Number(newRecord.amount)
      await user.save()
    }
    if (diffAmount !== 0) {
      user.totalAmount += diffAmount
      if (oldCatId.equals(newCatId)) {
        user.categoryAmount[allCat.findIndex(e => e._id.equals(newCatId))] += diffAmount
      }
      await user.save()
    }

    await Record.findOneAndUpdate(filter, newRecord, { new: true })
    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const record_id = req.params.id
    const filter = { _id: record_id, userId }

    // update totalAmount and categoryAmount of User model
    const allCat = await Category.find().lean() // name, id,fontawesomeStr of all category
    const oldRecord = await Record.findOne(filter)
    const oldCatId = oldRecord.categoryId
    const oldAmount = oldRecord.amount
    const user = await User.findOne({ _id: userId })
    user.categoryAmount[allCat.findIndex(e => e._id.equals(oldCatId))] -= oldAmount
    user.totalAmount -= oldAmount
    await user.save()
    await Record.findOneAndDelete(filter)

    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router
