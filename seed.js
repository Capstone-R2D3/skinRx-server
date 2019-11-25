const Products = require('./models/products')

const cheerio = require('cheerio');
const request = require('request');

const links = ['https://www.ewg.org/skindeep/browse/category/Facial_cleanser?page=1&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Facial_cleanser?page=9&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Facial_cleanser?page=11&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Toners__astringents?page=3&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Toners__astringents?page=4&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Toners__astringents?page=5&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Facial_moisturizer__treatment?page=7&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Facial_moisturizer__treatment?page=19&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Facial_moisturizer__treatment?page=24&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Serums_&_Essences?page=5&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Serums_&_Essences?page=10&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Serums_&_Essences?page=16&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Mask?page=4&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Mask?page=6&per_page=36',
'https://www.ewg.org/skindeep/browse/category/Mask?page=12&per_page=36'
]

function scrapeProducts (url, category) {
  request(url, (error, response, body) => {
    if(error) console.log(error)
    const $ = cheerio.load(body);
    $('.product-tile').each((i, element) => {
        const brand = $(element).find('.product-company').children('a').text();
        const productUrl = $(element).find('.product-name').children('a').attr('href');
        request(productUrl, (err, res, b) => {
          const productPage = cheerio.load(b);
          const name = productPage('.product-name').text();
          const ingredients = [];
          productPage('.table-ingredient-concerns').find('tr').each((j, elem) => {
              const ingredientName = productPage(elem).find('.td-ingredient-interior').children('a').text();
              const ingredientScore = String(productPage(elem).find('.ingredient-score').attr('src')).substring(52, 54);
              ingredients.push(`${ingredientName} : ${ingredientScore}`);
          });
          Products.create({brand, name, ingredients, category});
        })
    });
  })
}

links.forEach((link, index) => {
  let category;
  if (index < 3) {
    category = 'Cleanser'
  } else if (index > 2 && index < 6) {
    category = 'Toner'
  } else if (index > 5 && index < 9) {
    category = 'Moisturizer'
  } else if (index > 8 && index <12) {
    category = 'Serum'
  } else if (index > 11) {
    category = 'Mask'
  }
  scrapeProducts(link, category);
});
