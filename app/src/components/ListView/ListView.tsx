import React, { useEffect, useRef, useState } from 'react'

interface ListViewProps {
  children: React.ReactNode
  rowsPerPage?: number
  height?: number
  itemCount: number
  className?: string
}

const ListView: React.FC<ListViewProps> = ({
  children,
  rowsPerPage = 15,
  itemCount,
  height = 500,
  className = ''
}) => {
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!listRef.current || !listRef.current.lastElementChild) return
    const options = {
      root: listRef.current,
      rootMargin: '100px'
    }

    const lastObserver = new IntersectionObserver((entries) => {
      const item = entries?.[0]
      if (!item.isIntersecting) return
      lastObserver.unobserve(item.target)
      setPage((p) => {
        const value = Math.min(Math.ceil(itemCount / rowsPerPage), p + 1)
        return value
      })
    }, options)

    const firstObserver = new IntersectionObserver((entries) => {
      const item = entries?.[0]
      if (!item.isIntersecting) return
      firstObserver.unobserve(item.target)
      setPage((p) => {
        const value = Math.max(1, p - 1)
        return value
      })
    }, options)

    const firstElement = listRef.current.firstElementChild
    const lastElement = listRef.current.lastElementChild

    if (page > 1 && firstElement) {
      firstObserver.observe(firstElement)
    }
    lastObserver.observe(lastElement)

    return () => {
      if (page > 1 && firstElement) {
        firstObserver.unobserve(firstElement)
      }
      lastObserver.unobserve(lastElement)
    }
  }, [page])

  return (
    <ul
      className={`${className}`}
      ref={listRef}
      style={{
        maxHeight: `${height}px`,
        overflowY: 'auto',
        overflowX: 'hidden',
        listStyleType: 'none',
        border: '1px solid lightgray',
        borderRadius: '10px'
      }}
    >
      {React.Children.map(children, (child: any, index) => {
        if (index > rowsPerPage * page || rowsPerPage * (page - 2) > index)
          return null
        return React.cloneElement(child, {})
      })}
    </ul>
  )
}

export default ListView
