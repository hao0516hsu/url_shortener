const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)
module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  getIndex: function (value, page, options) {
    return (parseInt(page) - 1) * 10 + parseInt(value) + 1;
  },
  getDate: dataDate => dayjs(dataDate).format('YYYY/MM/DD'),
  getDatetime: dataDate => dayjs(dataDate).format('YYYY/MM/DD HH:mm:ss'),
  cutString: str => {
    if (str.length > 70) {
      str = str.slice(0, 70).trim().concat('...')
    }
    return str
  }
}