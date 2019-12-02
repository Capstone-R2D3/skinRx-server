const Ingredients = require('./model/ingredients');
const cheerio = require('cheerio');
const request = require('request');

const URLs = [
    'https://www.ewg.org/skindeep/search?page=1&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=2&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=3&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=4&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=5&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=6&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=7&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=8&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=9&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=10&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=11&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=12&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=13&per_page=36&search_type=ingredients',
    'https://www.ewg.org/skindeep/search?page=14&per_page=36&search_type=ingredients'
    // 'https://www.ewg.org/skindeep/search?page=15&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=16&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=17&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=18&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=19&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=20&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=21&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=22&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=23&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=24&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=25&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=26&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=27&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=28&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=29&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=30&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=31&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=32&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=33&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=34&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=35&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=36&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=37&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=38&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=39&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=40&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=41&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=42&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=43&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=44&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=45&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=46&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=47&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=48&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=49&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=50&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=51&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=52&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=53&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=54&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=55&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=56&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=57&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=58&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=59&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=60&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=61&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=62&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=63&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=64&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=65&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=66&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=67&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=68&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=69&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=70&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=71&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=72&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=73&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=74&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=75&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=76&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=77&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=78&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=79&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=80&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=81&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=82&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=83&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=84&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=85&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=86&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=87&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=88&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=89&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=90&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=91&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=92&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=93&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=94&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=95&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=96&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=97&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=98&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=99&per_page=36&search_type=ingredients',
    // 'https://www.ewg.org/skindeep/search?page=100&per_page=36&search_type=ingredients'
]

function scrapeIngredients (URL) {
    request(URL, function (err, response, body) {
        if (err) console.error(err);

        const $ = cheerio.load(body);

        $('.product-tile').each(
            function (idx, element) {
                if (this) {
                    const ingredient = {};

                    ingredient.name = $(element).find('.product-name').children('a').text().toLowerCase();

                    const src = $(element).find('.product-score').children('img').attr('src');

                    let max;
                    if (src.slice(35, 36) === '0') {
                        max = src.slice(34, 36);
                    } else {
                        max = src.slice(34, 35);
                    }

                    let min;
                    const end = src.length - 1;
                    if ((src[end]) === '0') {
                        min = src.slice(end - 1);
                    } else {
                        min = src.slice(end);
                    }

                    if (min === max) {
                        ingredient.toxicity = min;
                    } else {
                        ingredient.toxicity = `${min}-${max}`;
                    }

                    ingredient.data = $(element).find('span').text();

                    Ingredients.create(ingredient);
                }
            }
        )
    })
}

URLs.forEach(url => {
    scrapeIngredients(url);
})
