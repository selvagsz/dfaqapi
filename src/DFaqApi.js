import Pretender from 'pretender'
import loki from 'lokijs'

/*
  let fakeApi = new DFaqApi({
    apiPrefix: '/v1',
    factories: {
      user: Factory.extend({
        name: faker.name()
      })
    }
  })
 */

export default class DFaqApi {
  constructor(options) {
    this.apiPrefix = options.apiPrefix || ''
    this.factories = options.factories || {}
    this.db = new loki('dfaqapi.db')
    let supportedMethods = ['get', 'post', 'put', 'delete']

    this.server =  new Pretender(function () {
      supportedMethods.forEach((method) => {
        this[method]('/*wildcard', this.passthrough)
      })
    })

    supportedMethods.forEach((method) => {
      Object.defineProperty(this, method, {
        value: function(url, handler) {
          let normalizedUrl = normalizeUrl(`${this.apiPrefix}/${url}`)
          this.server[method](normalizedUrl, (request) => {
            return [
              200,
              {
                'Content-Type': 'application/json'
              },
              JSON.stringify(handler(this.db, request))
            ]
          })
        }
      })
    })
  }

  createList(name, count) {
    let collection = this.db.getCollection(name) || this.db.addCollection(name)
    let Factory = this.factories[name]

    if (!Factory) {
      throw new Error(`No factory for ${name} provided`)
    }

    for (let i=0; i<count; i++) {
      collection.insert(new Factory().getJSON())
    }
  }

  shutdown() {
    this.server.shutdown()
  }
}

const normalizeUrl = (url) => {
  return url.replace(/\/{2,}/g, '/')
}
