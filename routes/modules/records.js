const express = require('express')
const { populate } = require('../../models/record')
const router = express.Router()
// import Record model
const Record = require('../../models/record')
const moment = require('moment')
const User = require('../../models/user')

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
const isString = val => typeof val === 'string'

// Create a New expense
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
    const user_id = req.user._id
    const recordNumber = await Record.find({ user_id }).countDocuments()
    const id = recordNumber + 1
    const { name, date, categoryId, amount } = req.body
    const formattedDate = moment(date).format('YYYY/MM/DD')

    await Record.create({ id, name, date, formattedDate, amount, userId, user_id, categoryId })

    // update categoryAmount and totalAmount
    const user = await User.findOne({ id: userId })
    user.categoryAmount[categoryId - 1] += Number(amount)
    user.totalAmount += Number(amount)
    await user.save()

    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

// go to detail.hbs of an expense
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    // const user_id = req.user._id
    const record_id = req.params.id
    const record = await Record.findOne({ _id: record_id, userId }).lean()
    // console.log('go to detail page of record=', record)
    return res.render('detail', { record })
  } catch (error) {
    return console.error(error)
  }
})

// go to edit.hbs of an expense
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const record = await Record.findOne({ _id: record_id, userId }).lean()
    // console.log('go to edit of record=', record)
    // console.log('date=', record.date)
    const recordDate = moment(record.date).format('YYYY-MM-DD')
    // console.log('moment date=', recordDate)
    return res.render('edit', { record, recordDate })
  } catch (error) {
    return console.error(error)
  }
})

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id
    const record_id = req.params.id
    const filter = { _id: record_id, userId }
    const newRecord = { ...req.body }
    newRecord.formattedDate = moment(req.body.date).format('YYYY/MM/DD')

    // update totalAmount and categoryAmount
    const oldRecord = await Record.findOne(filter)
    const oldAmount = oldRecord.amount
    const newAmount = Number(newRecord.amount) // if dont use Number(), error will occur when update negative number
    const diffAmount = newAmount - oldAmount
    // console.log('diff=', diffAmount)
    // console.log('newA=', newAmount)
    // console.log('oldA=', oldAmount)

    // sometimes, user just change categoryId but not amount
    const oldCatId = oldRecord.categoryId
    const newCatId = newRecord.categoryId
    // console.log('newCat=', newCatId)
    // console.log('oldCat=', oldCatId)
    const user = await User.findOne({ id: userId })
    if (oldCatId !== newCatId) {
      user.categoryAmount[oldCatId - 1] -= oldAmount
      user.categoryAmount[newCatId - 1] += newAmount
      await user.save()
    }
    if (diffAmount !== 0) {
      user.totalAmount += diffAmount
      if (oldCatId === newCatId) {
        user.categoryAmount[newCatId - 1] += diffAmount
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
    const userId = req.user.id
    const record_id = req.params.id
    const filter = { _id: record_id, userId }

    // update totalAmount and categoryAmount
    const oldRecord = await Record.findOne(filter)
    const oldCatId = oldRecord.categoryId
    const oldAmount = oldRecord.amount
    const user = await User.findOne({ id: userId })
    user.categoryAmount[oldCatId - 1] -= oldAmount
    user.totalAmount -= oldAmount
    await user.save()
    await Record.findOneAndDelete(filter)

    return res.redirect('/')
  } catch (error) {
    return console.error(error)
  }
})

module.exports = router