// As a user I want to have the ability to refresh the price (open, high, low, close) of each symbol

class Symbols {  
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS symbols (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      open REAL,
      high REAL,
      low REAL,
      close REAL)`
    return this.dao.run(sql)
  }


  create(name, open, high, low, close) {
    return this.dao.run(
      'INSERT INTO symbols (name, open, high, low, close) VALUES (?, ?, ?, ?, ?)',
      [name, open, high, low, close])
  }

  update(symbol) {
    const { id, name, open, high, low, close } = symbol
    return this.dao.run(
      `UPDATE symbols SET name = ?, open = ?, high = ?, low = ?, close = ? WHERE id = ?`,
      [name, open, high, low, close, id]
    )
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM symbols WHERE id = ?`,
      [id]
    )
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM symbols WHERE id = ?`,
      [id])
  }

  getAll() {
    return this.dao.all(`SELECT * FROM symbols`)
  }

  getAllwithPrice(){
    return this.dao.all(`SELECT symbols.*,
    price
FROM symbols
LEFT JOIN portfolio ON symbols.name = portfolio.name`)
  }

}

module.exports = Symbols
