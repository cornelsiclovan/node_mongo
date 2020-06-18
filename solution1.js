const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB ...', err));

const coursSchema = new mongoose.Schema({
    name: String,
    author:  String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: String
});

const Course = mongoose.model('Course', coursSchema);

async function getCourses() {
    return await Course
        .find({ isPublished: true, tags: { $in: ['frontend', 'backend'] } })
        .sort({ price: -1 })
        .select({ name: 1, author: 1, price: 1});
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}

run();