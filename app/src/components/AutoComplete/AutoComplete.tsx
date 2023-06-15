import React, { useCallback, useEffect } from 'react'
import { TextInputWithAutoCompleteProps } from './types'

const ListLoading = () => {
  return (
    <>
      <li className='bg-gray-300 animate-pulse h-8 mx-2 my-2 w-auto mb-2 rounded-md'></li>
      <li className='bg-gray-300 animate-pulse h-8 mx-2 w-1/3 mb-2 rounded-md'></li>
      <li className='bg-gray-300 animate-pulse h-8 mx-2 w-1/2 mb-2 rounded-md'></li>
    </>
  )
}

const AutoComplete: React.FC<TextInputWithAutoCompleteProps> = ({
  children,
  suggestions = [],
  filterSuggestions,
  clearOnSelect,
  ...props
}) => {
  const [tempInput, setTempInput] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const suggestionsRef = React.useRef<HTMLUListElement>(null)
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (suggestions.length) setShowSuggestions(true)
    const value = e.target.value
    setTempInput(value)
    const suggestion = suggestions.find(
      (suggestion) => suggestion.value === value
    )
    if (suggestion) {
      props.onChange?.(suggestion)
      if (clearOnSelect && inputRef.current) {
        inputRef.current.value = ''
        setTempInput('')
        inputRef.current.focus()
      }
      setShowSuggestions(false)
    }
  }

  const onSuggestionClick = useCallback(
    (id: string) => {
      if (!inputRef.current) return
      const suggestion = suggestions.find((suggestion) => suggestion.id === id)
      if (!suggestion) return
      var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set
      nativeInputValueSetter?.call(inputRef.current, suggestion?.value)

      var event = new Event('input', { bubbles: true })
      inputRef.current.dispatchEvent(event)
    },
    [suggestions]
  )

  const filteredSuggestions = filterSuggestions
    ? filterSuggestions(suggestions, tempInput)
    : suggestions.filter((suggestion) =>
        suggestion.value.toLowerCase().includes(tempInput.toLowerCase())
      )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ulElement = suggestionsRef.current
      if (!ulElement) return

      const handleDownNavigation = () => {
        event.preventDefault()
        const activeElement = document.activeElement
        if (!activeElement?.classList.contains('autocomplete-input')) {
          const firstElement = ulElement.firstChild as HTMLElement
          firstElement?.focus()
          return
        }
        if (activeElement?.classList.contains('autocomplete-input')) {
          const nextElement = activeElement.nextElementSibling as HTMLElement
          nextElement?.focus()
        }
      }

      const handleUpNavigation = () => {
        event.preventDefault()
        const activeElement = document.activeElement
        if (activeElement?.classList.contains('autocomplete-input')) {
          const previousElement =
            activeElement.previousElementSibling as HTMLElement
          previousElement?.focus()
        }
      }

      const handleEnter = () => {
        const activeElement = document.activeElement
        if (activeElement?.classList.contains('autocomplete-input')) {
          const id = activeElement.getAttribute('data-id') as string
          onSuggestionClick(id)
        }
      }

      switch (event.key) {
        case 'Escape':
          setShowSuggestions(false)
          break
        case 'Down':
        case 'ArrowDown':
          handleDownNavigation()
          break
        case 'Up':
        case 'ArrowUp':
          handleUpNavigation()
          break
        case 'Enter':
          handleEnter()
          break
        default:
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onSuggestionClick])

  useEffect(() => {
    if (inputRef.current && !suggestions.length) {
      var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set
      nativeInputValueSetter?.call(inputRef.current, '')

      var event = new Event('input', { bubbles: true })
      inputRef.current.dispatchEvent(event)
    }
  }, [suggestions.length])

  return (
    <div className='relative w-full'>
      <input
        ref={inputRef}
        {...props}
        onFocus={() => setShowSuggestions(true)}
        onChange={onChange}
        onClick={() => setShowSuggestions(true)}
        autoComplete='off'
      />
      {showSuggestions && !!filteredSuggestions?.length && (
        <ul
          ref={suggestionsRef}
          className='shadow-md py-2 absolute top-[calc(100%+5px)] overflow-auto z-[60] bg-white scrollbar-thin list-none w-full border rounded-md max-h-52'
        >
          {filteredSuggestions
            .sort((a, b) => a.value.localeCompare(b.value))
            .map((suggestion) => (
              <li
                tabIndex={-1}
                data-id={suggestion.id}
                key={suggestion.id}
                onClick={() => onSuggestionClick(suggestion.id)}
                className='autocomplete-input p-2 mx-2 cursor-pointer hover:bg-gray-300 focus:bg-gray-300 focus-within:bg-gray-300 focus-visible:outline-none rounded-md'
              >
                {suggestion.value}
              </li>
            ))}
        </ul>
      )}
      {showSuggestions && !suggestions.length && (
        <ul
          ref={suggestionsRef}
          className='shadow-md py-2 absolute top-[calc(100%+5px)] overflow-auto z-[60] bg-white scrollbar-thin list-none w-full border rounded-md max-h-52'
        >
          <ListLoading />
        </ul>
      )}
    </div>
  )
}

export default AutoComplete
