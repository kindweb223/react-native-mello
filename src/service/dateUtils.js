import moment from 'moment'

const getDurationFromNow = (date) => {
  const now = moment()
  const hours = now.diff(date, 'hours')
  if (hours > 24) {
    return now.diff(date, 'days') + 'd'
  } else {
    return hours + 'h'
  }
}

export {
  getDurationFromNow,
}
