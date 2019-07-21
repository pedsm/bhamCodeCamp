const { readdir, readFile } = require('fs')
const fetch = require('node-fetch')
const { log, error } = console

var assert = require('assert');

describe('Pages', () => {
    it('should have at least one page', () => {
        readdir('./pages', (err, pages) => {
            if(err) { throw(err) }
            assert.equal((pages.length >= 1), true)
        })
    })
})

// Fetch all files to test
describe('Markdown', () => {
    const pages = readdir('./pages', function (err, pages) {
        for (page of pages) {
            readFile('./pages/' + page, function (err, content) {
                describe(`Testing links in ${page}`, () => {
                    if (err) { throw err }
                    const txt = content.toString()
                    const rawLinks = txt.match(/(https?:\/\/[^\s]+)/g) || []
                    const links = rawLinks.map(a => a.replace(')', ''))
                    links.forEach((link) => {
                        describe(`Fetching ${link}`, function () {
                            this.slow(2500)
                            this.timeout(10 * 1000)
                            it('should return status code > 400', function (done) {
                                fetch(link)
                                    .then((resp) => {
                                        // log(link)
                                        // log(resp.status)
                                        assert.equal(resp.status < 400, true)
                                        done()
                                    })
                                    .catch((err) => { done(err)})
                            })
                        })
                    })
                })
            })
        }
    })
})