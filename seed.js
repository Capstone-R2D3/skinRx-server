const Products = require("./models/products");

const cheerio = require("cheerio");
const request = require("request");

const links = [
  "https://www.ewg.org/skindeep/browse/category/Facial_cleanser?page=2&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Facial_cleanser?page=1&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Facial_cleanser?page=3&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Toners__astringents?id=Toners__astringents&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Toners__astringents?page=2&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Toners__astringents?page=4&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Facial_moisturizer__treatment?id=Facial_moisturizer__treatment&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Facial_moisturizer__treatment?page=3&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Facial_moisturizer__treatment?page=17&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Serums_&_Essences?page=5&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Serums_&_Essences?page=10&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Serums_&_Essences?page=16&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Mask?page=4&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Mask?page=6&per_page=36",
  "https://www.ewg.org/skindeep/browse/category/Mask?page=12&per_page=36"
];

function scrapeProducts(url, category) {
  request(url, (error, response, body) => {
    if (error) console.log(error);
    const $ = cheerio.load(body);
    $(".product-tile").each((i, element) => {
      let skinTypeId = Math.ceil(Math.random() * 5);
      // console.log("randomly assigning to each product", skinTypeId);
      const brand = $(element)
        .find(".product-company")
        .children("a")
        .text();
      const productUrl = $(element)
        .find(".product-name")
        .children("a")
        .attr("href");

      request(productUrl, (err, res, b) => {
        if (err) {
          console.log(err);
        } else {
          const productPage = cheerio.load(b);
          const name = productPage(".product-name").text();
          let imageUrl = productPage(".product-image").children("img").attr("src")
          const ingredients = [];
          productPage(".table-ingredient-concerns")
            .find("tr")
            .each((j, elem) => {
              const ingredientName = productPage(elem)
                .find(".td-ingredient-interior")
                .children("a")
                .text();
              // imageUrl = productPage(elem)
              // .find(".product-image")
              // .children("img")
              // .attr("src")
              // console.log('image url!!!!!', imageUrl)
              const ingredientScore = String(
                productPage(elem)
                  .find(".ingredient-score")
                  .attr("src")
              ).substring(52, 54);
              ingredients.push(`${ingredientName} : ${ingredientScore}`);
            });
          Products.create({ brand, name, ingredients, category, skinTypeId, imageUrl });
        }
      });
    });
  });
}

links.forEach((link, index) => {
  let category;

  if (index < 3) {
    category = "Cleanser";
  } else if (index > 2 && index < 6) {
    category = "Toner";
  } else if (index > 5 && index < 9) {
    category = "Moisturizer";
  } else if (index > 8 && index < 12) {
    category = "Serum";
  } else if (index > 11) {
    category = "Mask";
  }

  scrapeProducts(link, category);
});
