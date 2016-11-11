export const getRandom = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const parseReqBody = function(raw) {
  return raw.split('&').reduce((prev, curr) => {
    let parts = curr.split('=')
    prev[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1])
    return prev
  }, {})
}
