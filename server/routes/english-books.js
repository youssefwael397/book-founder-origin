const EnglishBook = require('../models/english-books')
const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
    }
})
const upload = multer({ storage: storage })


// create a new english Book
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const image = req.file;
        const body = {
            name: req.body.name,
            author: req.body.author,
            overview: req.body.overview,
            numberOfPages: req.body.numberOfPages,
            price: req.body.price,
            category: req.body.category,
            image: image.path
        }
        const englishBook = await new EnglishBook(body).save()
        res.send({
            englishBook
        })
    } catch (error) {
        res.send(error)
    }
})


// get all english books
router.get('/', async (req, res) => {
    try {
        const englishBooks = await EnglishBook.find()
        const reversedBooks = englishBooks.reverse();
        reversedBooks.forEach((book) => {
            const image = fs.readFileSync(book.image, { encoding: 'base64' })
            book.image = image
        })
        res.send(reversedBooks)
    } catch (error) {
        res.send(error)
    }
})

// get book by id
router.get('/:id', async (req, res) => {
    try {
        const englishBook = await EnglishBook.find({ _id: req.params.id })
        res.send({ status: 'ok', data: englishBook })
    } catch (error) {
        res.send({ status: 'error', error })
    }
})


router.put('/:id', upload.none(), async (req, res) => {
    try {
        if (req.body) {
            const prevEnglishBook = await EnglishBook.findOneAndUpdate(
                { _id: req.params.id },
                req.body
            )
            const newEnglishBook = await EnglishBook.findById(req.params.id)
            if (newEnglishBook !== prevEnglishBook) {
                res.json({ status: 'ok', data: newEnglishBook })
            }
        } else {
            res.status(404).json({ status: 'error', error: 'There is no changes' })
        }
    } catch (error) {
        res.send(error)
    }
})


router.delete('/:id', async (req, res) => {
    try {
        var englishBook = await EnglishBook.findByIdAndDelete(req.params.id);
        res.json({
            'status': 'ok',
            'data': `${englishBook.name} book 's been deleted successfully.`
        })
    } catch (error) {
        res.send({
            'status': 'error',
            'error': `Failed to delete ${englishBook.name} book. Try again.`
        })
    }
})

module.exports = router