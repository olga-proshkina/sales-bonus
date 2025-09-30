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

// const sellerStats = groupBy(
//   data.purchase_records,
//   (record) => record.seller_id
// );
const productsStats = groupBy(data.products, (record) => record.sku);
const sellerStats = groupBy(data.sellers, (record) => record.id);

console.log(productsStats);
console.log(sellerStats);

// function analyseReceipt(data) {
//   const seller = {};
//   seller.seller_id = data.purchase_records[0].seller_id;
//   seller.name = sellerStats[seller.seller_id][0].first_name + " " + sellerStats[seller.seller_id][0].last_name;
//   seller.revenue = calculateRevenueByReciept(data.purchase_records[0]);
//   seller.profit = calculateProfitByReciept(data.purchase_records[0]);
//   // let count = 0;
//   // seller.sales_counts =
//   // seller.sales_count = // Количество продаж
//   seller.top_products = {};
//   seller.top_products.push({sku: data.purchase_records.items[]})
//   seller.bonus = calculateBonusByProfit(0, 5, seller)
//   return seller;
// }

const result = data.purchase_records.reduce((seller, currentReciept) => {
  if (!seller[currentReciept.seller_id]) {
    seller[currentReciept.seller_id] = {
      seller_id: currentReciept.seller_id,
      name:
        sellerStats[currentReciept.seller_id][0].first_name +
        " " +
        sellerStats[currentReciept.seller_id][0].last_name,
      revenue: 0,
      profit: 0,
      sales_count: 0,
      top_products: {},
      bonus: 0,
    };
  }
    seller[currentReciept.seller_id].revenue +=
      calculateRevenueByReciept(currentReciept);
    seller[currentReciept.seller_id].profit +=
      calculateProfitByReciept(currentReciept);
    seller[currentReciept.seller_id].sales_count =
      seller[currentReciept.seller_id].sales_count + 1;
    seller[currentReciept.seller_id].top_products = currentReciept.items.reduce(
      (acc, currentItem) => {
        if (!acc[currentItem.sku]) {
          acc[currentItem.sku] = {
            sku: currentItem.sku,
            quantity: 0,
          };
        }
        acc[currentItem.sku].quantity += currentItem.quantity;
        return acc;
      },
      seller[currentReciept.seller_id].top_products
    );
  return seller;
}, {});
console.log(result);

// function topProducts(reciept) {
//   const topProducts10 = reciept.items.reduce((acc, currentItem) => {
//     if (!acc[currentItem.sku]) {
//       acc[currentItem.sku] = {
//         sku: currentItem.sku,
//         quantity: 0
//       }
//     }
//     acc[currentItem.sku].quantity += currentItem.quantity;
//       return acc;
//   }, {})
//   return topProducts10;
// }

// for (let reciept of data.purchase_records) {
//   topProducts(reciept)
// }
// console.log(topProducts(data.purchase_records));

// function calculateProfit(item) {
//    let profit = item.sale_price * item.quantity * (1 - item.discount / 100) - productsStats[item.sku][0].purchase_price * item.quantity;
//    return profit;
// }
// calculateProfit(sellerStats.seller_1[0].items[0]);
// console.log(profit);
function calculateSimpleRevenue(purchase) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  let simpleProfit = sale_price * quantity * (1 - discount / 100);
  return simpleProfit;
}
function calculateSimpleProfit(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  const { purchase_price } = _product;
  let simpleRevenue =
    sale_price * quantity * (1 - discount / 100) - purchase_price * quantity;
  return simpleRevenue;
}
function calculateRevenueByReciept(reciept) {
  let totalRevenueByReciept = reciept.items.reduce(
    (totalRevenue, currentItem) => {
      totalRevenue = totalRevenue + calculateSimpleRevenue(currentItem);
      return totalRevenue;
    },
    0
  );
  return totalRevenueByReciept;
}

function calculateProfitByReciept(reciept) {
  let totalProfitByReciept = reciept.items.reduce(
    (totalProfit, currentItem) => {
      totalProfit =
        totalProfit +
        calculateSimpleProfit(currentItem, productsStats[currentItem.sku][0]);
      return totalProfit;
    },
    0
  );
  return totalProfitByReciept;
}

// const total = calculateProfitByReciept(sellerStats.seller_1[0]);
// console.log(total);

// function calculateProfitBySeller(seller_id) {
//   let totalProfitBySeller = seller_id.reduce((totalProfit, currentReciept) => {
//     totalProfit = totalProfit + calculateProfitByReciept(currentReciept);
//     return totalProfit;
//   }, 0);
//   return totalProfitBySeller;
// }

// console.log(sellerStats.seller_1[0]);
// const profitSeller1 = calculateProfitBySeller(sellerStats.seller_1);
// console.log(profitSeller1);

function calculateBonusByProfit(index, total, seller) {
  const { profit } = seller;
  let x;
  if (index === total - 1) {
    x = 0;
  } else if (index === 1 || index === 2) {
    x = 0.1;
  } else if (index === 0) {
    x = 0.15;
  } else {
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
