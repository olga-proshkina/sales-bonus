
//  if (!data || !Array.isArray(data.sellers) || data.sellers.length === 0) { 
//     throw new Error('Некорректные входные данные');
// } 

// //  const { calculateRevenue, calculateBonus } = options;

//  if (typeof options === !"object" || typeof calculateRevenue === !"function") {
//      throw new Error('Некорректные входные данные');
//  }

//  if (!{ calculateRevenue, calculateBonus } || !otherVar) {
//     throw new Error('Чего-то не хватает');
// }

function groupBy(array, keyFn) {

    // @param array -- массив данных
    // @param keyFn -- ключ сорторовки
    // @returns {*} -- на выходе получаем объект, например: {seller_id: [], ....}
  
   return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
   }, {});
}

const sellerStats = groupBy(data.purchase_records, record => record.seller_id);

console.log(sellerStats);

    





//  * Функция для расчета выручки
//  * @param purchase запись о покупке
//  * @param _product карточка товара
//  * @returns {number}
//  */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    // 15% — для продавца, который принёс наибольшую прибыль.
    // 10% — для продавцов, которые по прибыли находятся на втором и третьем месте.
    // 5% — для всех остальных продавцов, кроме самого последнего.
    // 0% — для продавца на последнем месте.
    const { profit } = seller;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    const { calculateRevenue, calculateBonus } = options;

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
