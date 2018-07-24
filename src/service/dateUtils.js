import moment from 'moment'

const getPastHoursFromNow = (date) => {
  return moment.duration(date).asHours()
}

export {
  getPastHoursFromNow,
}
