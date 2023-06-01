export class dueDateCalc {
  public static getdueDate = (seconds: number): string => {
    return `
    ${
      this.getDurationSegments(seconds).weeks > 0
        ? this.getDurationSegments(seconds).weeks + 'weeks'
        : ''
    } 
    ${
      this.getDurationSegments(seconds).days > 0
        ? this.getDurationSegments(seconds).days + 'days '
        : ''
    }
    ${
      this.getDurationSegments(seconds).hours > 0
        ? this.getDurationSegments(seconds).hours + 'hours'
        : ''
    }
    `
  }

  public static getDurationInSeconds(params: {
    weeks: number
    days: number
    hours: number
  }): number {
    return params.weeks * 604800 + params.days * 86400 + params.hours * 3600
  }

  public static getDurationInDays(seconds: number): number {
    return Math.trunc(seconds / 86400)
  }

  public static getDurationSegments = (
    seconds: number
  ): { weeks: number; days: number; hours: number } => {
    const weeks = Math.trunc(seconds / 604800)
    const days = Math.trunc((seconds / (3600 * 24)) % 7)
    const hours = (seconds % (3600 * 24)) / 3600
    return {
      weeks: weeks > 0 ? weeks : 0,
      days: days > 0 ? days : 0,
      hours: hours > 0 ? hours : 0
    }
  }
}
