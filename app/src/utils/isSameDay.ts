export const isSameDay = (timestampA: number, timestampB: number) => {
  const dateA = new Date(timestampA)
  const dateB = new Date(timestampB)
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  )
}

export default isSameDay
