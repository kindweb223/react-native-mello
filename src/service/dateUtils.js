import moment from 'moment'

const getDurationFromNow = (date) => {
  const now = moment()
  const hours = now.diff(date, 'hours')

  // Return days if over 24 hours
  if (hours > 24) {
    const days = now.diff(date, 'days')
    return days + 'd'
  }
  // Return hours over an hour and less than a day
  else if (hours > 0) {
    return hours + 'h'
  }
  // Return minutes if less then an hour
  else {
    const minutes = now.diff(date, 'minutes')
    if (minutes > 0) {
      return minutes + 'm'
    }
    return 'just now'
  }
}

const getFullDurationFromNow = (date) => {
  const now = moment()
  const hours = now.diff(date, 'hours')

  // Return days if over 24 hours
  if (hours > 24) {
    const days = now.diff(date, 'days')

    if (days === 1)
      return days + ' day'

    return days + ' days'
  }
  // Return hours over an hour and less than a day
  else if (hours > 0) {
    if (hours === 1)
      return hours + ' hour'

    return hours + ' hours'
  }
  // Return minutes if less then an hour
  else {
    const minutes = now.diff(date, 'minutes')
    if (minutes > 0) {
      if (minutes === 1)
        return minutes + ' min'
  
      return minutes + ' mins'
    }
    return 'just now'
  }
}

const getTimestamp = (date) => {
  // 17:15 - 22 Aug 2018
  return moment(date).format('H:mm - D MMM YYYY')
}
export {
  getDurationFromNow,
  getFullDurationFromNow,
  getTimestamp,
}
