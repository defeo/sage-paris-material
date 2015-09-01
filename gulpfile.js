var gulp = require('gulp'),
    frontMatter = require('gulp-front-matter'),
    sass = require('gulp-sass'),
    swig = require('swig'),
    through = require('through2'),
    path = require('path');

gulp.task('build:layout', function() {
    return gulp.src('./*.html')
	.pipe(frontMatter({ property: 'page' }))
	.pipe(applyTemplate())
	.pipe(gulp.dest('./build'));
});

gulp.task('build:sass', function() {
    return gulp.src('./src/css/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./build/css'));
});

gulp.task('build:assets', function() {
    gulp.src('./src/**/*.@(js|css|png|jpg)', { base: 'src' })
	.pipe(gulp.dest('./build'));
});

gulp.task('build', ['build:layout', 'build:sass', 'build:assets']);

gulp.task('default', ['build']);
	  
function applyTemplate() {
    return through.obj(function (file, enc, cb) {            
	var tpl = swig.compileFile(path.join(__dirname, 'src/layouts', file.page.layout + '.html'));
	
        var data = {
            page: file.page,
            content: file.contents.toString()
        };
        file.contents = new Buffer(tpl(data), 'utf8');
        this.push(file);
        cb();
    });
}
