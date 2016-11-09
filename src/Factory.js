export default class Factory {
  getJSON() {
    return Object.keys(this).reduce((prev, curr) => {
      if (this.hasOwnProperty(curr)) {
        prev[curr] = this[curr]
      }
      return prev
    }, {})
  }
}
