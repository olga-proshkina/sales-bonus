/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  let simpleRevenue = sale_price * quantity * (1 - discount / 100);
  return simpleRevenue;
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

function calculateSimpleProfit(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  const { purchase_price } = _product;
  let simpleRevenue =
    sale_price * quantity * (1 - discount / 100) - purchase_price * quantity;
  return simpleRevenue;
}



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

function toSort(array, field) {
  array.sort((a, b) => {
    if (a[field] > b[field]) {
      return -1;
    }
    if (a[field] < b[field]) {
      return 1;
    }
    return 0;
  });
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  // @TODO: Проверка входных данных

  if (!data || !Array.isArray(data.sellers) || data.sellers.length === 0) {
    throw new Error("Некорректные входные данные");
  }
  // @TODO: Проверка наличия опций
  if (typeof options === !"object") {
    throw new Error("Некорректные входные данные");
  }
  const { calculateRevenue, calculateBonus } = options;
  if (
    typeof calculateRevenue === !"function" ||
    typeof calculateBonus === !"function"
  ) {
    throw new Error("Некорректные входные данные");
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики
  const productsStats = groupBy(data.products, (record) => record.sku);
  const sellerStats = groupBy(data.sellers, (record) => record.id);

  // @TODO: Индексация продавцов и товаров для быстрого доступа

  // @TODO: Расчет выручки и прибыли для каждого продавца
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

    let totalRevenueByReciept = currentReciept.items.reduce(
      (totalRevenue, currentItem) => {
        totalRevenue = totalRevenue + calculateRevenue(currentItem);
        return totalRevenue;
      },
      0
    );
    let totalProfitByReciept = currentReciept.items.reduce(
      (totalProfit, currentItem) => {
        totalProfit =
          totalProfit +
          calculateSimpleProfit(currentItem, productsStats[currentItem.sku][0]);
        return totalProfit;
      },
      0
    );

    seller[currentReciept.seller_id].revenue += totalRevenueByReciept;
    //   calculateRevenueByReciept(currentReciept);
    seller[currentReciept.seller_id].profit += totalProfitByReciept;
    //   calculateProfitByReciept(currentReciept);
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
  // @TODO: Сортировка продавцов по прибыли
  const resultArray = Object.values(result);
  toSort(resultArray, "profit");
  for (i = 0; i < resultArray.length; i++) {
    resultArray[i].bonus = calculateBonus(
      i,
      resultArray.length,
      resultArray[i]
    );
  }
  // @TODO: Назначение премий на основе ранжирования

  // @TODO: Подготовка итоговой коллекции с нужными полями

  resultArray.forEach((element) => {
    element.top_products = Object.values(element.top_products);
    toSort(element.top_products, "quantity");
    element.top_products = element.top_products.slice(0, 10);
    element.profit = Number.parseFloat(element.profit.toFixed(2));
    element.revenue = Number.parseFloat(element.revenue.toFixed(2));
    element.bonus = Number.parseFloat(element.bonus.toFixed(2));
  });
  return resultArray;
}