import faker from 'faker'
import { getRandom } from './utils'

faker.utils = faker.utils || {}

faker.utils.oneOf = function(arr) {
  return arr[getRandom(0, arr.length - 1)]
}

export default faker
