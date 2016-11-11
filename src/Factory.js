import faker from './faker'

export default class Factory {
  belongsTo(entity) {
    let db = this.constructor.db
    let collection = db.getCollection(entity) || db.addCollection(entity)
    return faker.utils.oneOf(collection.data)
  }

  getJSON() {
    return Object.keys(this).reduce((prev, curr) => {
      if (this.hasOwnProperty(curr)) {
        prev[curr] = this[curr]
      }
      return prev
    }, {})
  }
}
