/** @format */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // load on demand

class TimeHelper {
  constructor() {
    dayjs.locale('zh-cn')
    dayjs.extend(relativeTime)
  }
  showRelativeTime(time: number) {
    let yestoday = dayjs().subtract(1, 'day')
    let currentTime = dayjs(time)
    if (currentTime.isAfter(yestoday)) {
      return currentTime.fromNow()
    } else {
      return currentTime
        .format('MM-DD HH:mm')
    }
  }

  showTimeString(time: number) {
    return dayjs(time)
      .format('MM-DD HH:mm')
  }
}
export default TimeHelper
