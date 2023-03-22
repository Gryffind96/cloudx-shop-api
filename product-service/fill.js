const db = require('./db')

const productsTableParams = {
  RequestItems: {
    products: [
      {
        PutRequest: {
          Item: {
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            description: 'Naruto storm 4 for Xbox series X',
            price: 24,
            title: 'Naruto storm 4'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            description: 'Zelda game for Nintendo Switch',
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
            price: 15,
            title: 'Zelda Breath of the wild'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            description: 'Pre-order game for Nintendo Switch',
            id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
            price: 23,
            title: 'Zelda tears of the kingdom'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            description: 'Shooter game available for PS5',
            id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
            price: 15,
            title: 'COD: Modern warfare 2'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            description: 'Strategy game serial key for Steam',
            id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
            price: 23,
            title: 'Company Heroes 3'
          }
        }
      },
      {
        PutRequest: {
          Item: {
            description: 'Real time strategy game for PC',
            id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
            price: 15,
            title: 'Age of empires 4'
          }
        }
      }
    ]
  }
}

db.batchWrite(productsTableParams).promise()

const stocksTableParams = {
  RequestItems: {
    stocks: [
      {
        PutRequest: {
          Item: {
            product_id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            count: 2
          }
        }
      },
      {
        PutRequest: {
          Item: {
            product_id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
            count: 7
          }
        }
      },
      {
        PutRequest: {
          Item: {
            product_id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
            count: 10
          }
        }
      },
      {
        PutRequest: {
          Item: {
            product_id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
            count: 22
          }
        }
      },
      {
        PutRequest: {
          Item: {
            product_id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
            count: 11
          }
        }
      },
      {
        PutRequest: {
          Item: {
            product_id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
            count: 999
          }
        }
      }
    ]
  }
}

db.batchWrite(stocksTableParams).promise()
