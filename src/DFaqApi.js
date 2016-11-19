import Pretender from 'pretender'
import loki from 'lokijs'
import { parseReqBody } from './utils'

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
    this.delay = options.delay || 1000
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
            if ((method === 'post' || method === 'put') && request.requestBody) {
              request.parsedRequestBody = parseReqBody(request.requestBody)
            }
            return [
              method === 'post' ? 201 : 200,
              {
                'Content-Type': 'application/json'
              },
              JSON.stringify(handler(this.db, request))
            ]
          }, this.delay)
        }
      })
    })
  }

  createList(name, count, factory) {
    let collection = this.db.getCollection(name) || this.db.addCollection(name)
    let Factory = factory || this.factories[name]

    if (!Factory) {
      throw new Error(`No factory for ${name} provided`)
    }
    Factory.db = this.db

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
