import moment from 'moment'

const getDurationFromNow = (date) => {
  const now = moment()
  const hours = now.diff(date, 'hours')
  if (hours > 24) {
    return moment(date).format('MMMM D')
  } else if (hours > 0) {
    return hours + 'h'
  } else {
    const minutes = now.diff(date, 'minutes')
    if (minutes > 0) {
      return minutes === 1 ? minutes + ' min' : minutes + ' mins'
    }
    return 'just now'
  }
}

export {
  getDurationFromNow,
}
