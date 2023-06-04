let dataGlobal;
const languages = ['en', 'de', 'es', 'fr'];

const getData = async () => {
  const response = await fetch('./data2.json');
  const data = await response.json();
  dataGlobal = data;
  return data;
};

const downloadJsonFile = (json, language) => {
  const dataStr = JSON.stringify(json, null, 2);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', dataUri);
  downloadLink.setAttribute('download', `${language}.json`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

(async () => {
  await getData();
  languages.forEach((language) => {
    let json = {
      showAttributes: dataGlobal.showAttributes,
      products: [],
      areas: [],
      categories: [],
    };

    dataGlobal.areas.forEach((area) => {
      const formattedArea = {
        id: area.id,
        label: area[language] ? area[language] : area.label,
      };
      json.areas.push(formattedArea);
    });

    dataGlobal.categories.forEach((category) => {
      const contentCategoryLanguage =
        'content_category_' + language.toUpperCase();
      const formattedCategory = {
        id: category.id,
        label: category[language] ? category[language] : category.label,
        parent: category.parent,
        content_category: category[contentCategoryLanguage],
      };
      json.categories.push(formattedCategory);
    });

    dataGlobal.products.forEach((product) => {
      const imageLanguage = 'image_' + language.toUpperCase();
      const formattedProduct = {
        id: product.id,
        link_type: product.link_type,
        item_code: product.item_code,
        family_code: product.family_code,
        featured_code: product.featured_code,
        start_date: product.start_date,
        end_date: product.end_date,
        offer: product.offer,
        sponsored: product.sponsored,
        focus: product.focus,
        image:
          language === 'en'
            ? product.image
            : product[imageLanguage]
            ? product[imageLanguage]
            : product.image,
        supplier: product.supplier,
        teaser: product[language]._teaser
          ? product[language]._teaser
          : product.en_teaser,
        bullet: product[language].bullet
          ? product[language].bullet
          : product.bullet,
        countries: product.countries,
        categories: product.categories,
        areas: product.areas,
        url: product.url,
        title: product[language].title,
        offer: product[language].offer,
        bullet: product[language].bullet,
        teaser: product[language].teaser,
        tableTitle: product[language].tableTitle,
        tableContent: product[language].tableContent,
      };

      json.products.push(formattedProduct);
    });

    downloadJsonFile(json, language);
    console.log({ json });
  });
})();
