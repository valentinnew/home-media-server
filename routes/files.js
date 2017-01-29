var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();


var WorkDir = function(baseDir, inputDir){
    console.log("inputDir", inputDir);
    var isCorrect = path.join(baseDir, inputDir).slice(0, baseDir.length) === baseDir,
        absWorkDir = isCorrect ? path.join(baseDir, inputDir) : baseDir,
        isBasrDir = path.relative(baseDir, absWorkDir) === '',
        dir = path.relative(baseDir, absWorkDir);
    /**
     * Возвращает абсолютный путь до рабочего каталога
     */
    this.getAbsolutePath = function(){
        return absWorkDir;
    };
    /**
     * Возвращает путь до рабочего каталога относительно базового каталога
     * @return string
     */
    this.getRelativePath = function(){
        if(isBasrDir){
            return '';
        } else {
            return dir + "/";
        }
    };

    /**
     * Возвращает путь до каталога родителя относительно базовоо, или false, если это базовый каталог
     */
    this.getParentRelativePath = function(){
        var parentAbsPath = path.join(absWorkDir, '../');
        if(isBasrDir){
            return '';
        } else {
            return path.relative(baseDir, parentAbsPath);
        }
    };

    /**
     * Проверяет, является ли рабочий каталог базовым
     */
    this.isBaseDir = function(){
        return isBasrDir;
    };
};

var baseDir = '/var/lib/library/';

router.get('/', function(req, res, next) {
    var workdir = new WorkDir(baseDir, req.query.dir || '');
    console.log({
        "isBaseDir": workdir.isBaseDir(),
        "AbsolutePath": workdir.getAbsolutePath(),
        "Relative": workdir.getRelativePath(),
        "ParentRelativePath": workdir.getParentRelativePath(),
    });
    fs.readdir(workdir.getAbsolutePath(), {}, function(err, files){
        var ls = [];
        for(var i in files){
            var file = {
                name: files[i],
                isDirectory: fs.lstatSync(path.join(workdir.getAbsolutePath(), files[i])).isDirectory()
            };
            ls.push(file);
        }

        res.render('files', {
            title: 'File list',
            files: ls,
            workDir: workdir.getRelativePath(),
            parentDir: workdir.getParentRelativePath()
        });
    });
});

module.exports = router;
