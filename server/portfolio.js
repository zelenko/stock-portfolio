// As a user I want to be able to be able to create, update, view and delete symbols from my portfolio
// As a user I want to a have a visual indicator when the Buy Price is higher than the close price
// As a user I want the ability to specify the number of shares I bought for a given stock 
// As a user I want the ability to specify the price I paid to buy the given stock
// As a user I want to see my prices in USD currency only

class Portfolio {  
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      qty REAL,
      price REAL)`
    return this.dao.run(sql)
  }


  create(name, qty, price) {
    return this.dao.run(
      'INSERT INTO portfolio (name, qty, price) VALUES (?, ?, ?)',
      [name, qty, price])
  }

  update(symbol) {
    const { id, name, qty, price } = symbol
    return this.dao.run(
      `UPDATE portfolio SET name = ?, qty = ?, price = ? WHERE id = ?`,
      [name, qty, price, id]
    )
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM portfolio WHERE id = ?`,
      [id]
    )
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM portfolio WHERE id = ?`,
      [id])
  }

  getAll() {
    return this.dao.all(`SELECT * FROM portfolio`)
  }

  getAllwithClosePrice(){
    return this.dao.all(`SELECT portfolio.*,
    close
FROM portfolio
LEFT JOIN symbols on symbols.name = portfolio.name`)
  }

}

module.exports = Portfolio
