const { markdown } = require('markdown')
const { readdir, readFile, readFileSync, fstat, writeFile } = require('fs')
const { spawn } = require('child_process')

const { log, error } = console
const header = readFileSync('./src/header.html').toString()

function compilePage(route) {
    log(`Building page ${route}`)
    readFile(`pages/${route}`, (err, data) => {
        if (err) { error(err) }
        const html = markdown.toHTML(data.toString())
        writeFile(`dist/${route.split('.')[0]}.html`, header + html, (err) => {
            if (err) { error(err); return }
            log(`${route} page compiled`)
        })
    })
}

function build() {
    log('Copying media')
    spawn('cp', ['-r', 'media', './dist/.'])
    spawn('mkdir', ['dist'])
    readdir('pages', (err, pages) => {
        if (err) { error(err) }
        pages.forEach(compilePage)
    })
}

build()