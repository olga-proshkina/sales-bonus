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

const sellerStats = groupBy(
  data.purchase_records,
  (record) => record.seller_id
);
const productsStats = groupBy(data.products, (record) => record.sku);

console.log(productsStats);
console.log(sellerStats);

// function calculateProfit(item) {
//    let profit = item.sale_price * item.quantity * (1 - item.discount / 100) - productsStats[item.sku][0].purchase_price * item.quantity;
//    return profit;
// }
// calculateProfit(sellerStats.seller_1[0].items[0]);
// console.log(profit);
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  const { purchase_price } = _product;
  let simpleRevenue =
    sale_price * quantity * (1 - discount / 100) - purchase_price * quantity;
  return simpleRevenue;
}

function calculateProfitByReciept(reciept) {
  let totalProfitByReciept = reciept.items.reduce(
    (totalProfit, currentItem) => {
      totalProfit =
        totalProfit +
        calculateSimpleRevenue(currentItem, productsStats[currentItem.sku][0]);
      return totalProfit;
    },
    0
  );
  return totalProfitByReciept;
}

const total = calculateProfitByReciept(sellerStats.seller_1[0]);
console.log(total);

function calculateProfitBySeller(seller_id) {
  let totalProfitBySeller = seller_id.reduce((totalProfit, currentReciept) => {
    totalProfit = totalProfit + calculateProfitByReciept(currentReciept);
    return totalProfit;
  }, 0);
  return totalProfitBySeller;
}

console.log(sellerStats.seller_1[0]);
const profitSeller1 = calculateProfitBySeller(sellerStats.seller_1);
console.log(profitSeller1);

function calculateBonusByProfit(index, total, seller) {
  const { profit } = seller;
  let x;
  if (index === total - 1) {
    x = 0;
  }
  else if (index === 1 || index === 2) {
    x = 0.1;
  }
  else if (index === 0) {
    x = 0.15;
  } 
  else {
    x = 0.05;
  }
  return profit * x;
}



//
//     const profit = calculateSimpleRevenue(item, product);
//
// })

// calculateRevenue("seller_1")

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */



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
