const {Ingredients} = require('./models/associations');
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
