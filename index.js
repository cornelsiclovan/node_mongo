const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB ...', err));


const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/ 
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                // Do some async work
                setTimeout(function() {
                    const result =  v && v.length > 0;
                    callback(result);
                }, 4000);
            },
            message: 'A course should have at least one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: { 
        type: Number, 
        required : function(){
            return this.isPublished;
        },
        min: 10,
        max: 200
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular.js Course',
        category: 'web',
        author: 'Mosh',
        tags: null,
        isPublished: true,
        price: 15
    });
    
    try{
         const result = await course.save();
         console.log(result);
    } 
    catch (ex) {
        console.log(ex.message);
    }
        
}

createCourse();

async function getCourses() {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lt (less than or equal to)
    // in
    // nin (not in)

    // or
    // and

    const pageNumber = 2;
    const pageSize = 10;
    

    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .skip((pageNumber -1 ) * pageSize)
        .limit(pageSize)
        //.find({ price: { $gte: 10 , $lte: 20} })
        //.find({ price: { $in: [10, 15, 20] } }) 
        //.find()
        //.or([ { author: 'Mosh' }, { isPublished: true } ])
        // Starts with Mosh
        //.find({ author: /^Mosh/ })
        // Ends with Hamedami case insensitive
        //.find({ author: /Hamedani$/i })
        // Contains Mosh case insensitive
        //.find({ author: /.*Mosh.*/i })
        //.and([])
        .limit(10)
        .sort({ name: 1 })
        .count();

    console.log(courses);
}

//getCourses()

async function updateCourse(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'JaJasonck',
            isPublished: false
        }
    }, {new: true});
    
    console.log(course);
}

//updateCourse('5eeb42db6c2fc84a80155bd7');

async function removeCourse(id) {
   // const result = await Course.deleteOne({ _id: id });
   const course = await Course.findByIdAndRemove(id)
   console.log(course);
}

// removeCourse('5eeb42db6c2fc84a80155bd7');