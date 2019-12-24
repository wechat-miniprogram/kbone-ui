const {src, dest} = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const less = require('gulp-less')
const path = require('path')

const DIST_PATH = path.join(__dirname, '../../lib/weui')


function compile() {
    return src('./weui.less')
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(dest(DIST_PATH))
}

exports.compile = compile
