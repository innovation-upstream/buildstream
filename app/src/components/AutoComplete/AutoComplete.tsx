import React, { useEffect } from 'react'
import { TextInputWithAutoCompleteProps } from './types'

const AutoComplete: React.FC<TextInputWithAutoCompleteProps> = ({
  children,
  suggestions = [],
  filterSuggestions,
  ...props
}) => {
  const [tempInput, setTempInput] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const suggestionsRef = React.useRef<HTMLUListElement>(null)
  const [showSuggestions, setShowSuggestions] = React.useState(
    suggestions.length > 0
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTempInput(value)
    const suggestion = suggestions.find(
      (suggestion) => suggestion.value === value
    )
    if (suggestion) {
      props.onChange?.(suggestion)
      return
    }
  }

  const onSuggestionClick = (id: string) => {
    if (!inputRef.current) return
    const suggestion = suggestions.find(
      (suggestion) => suggestion.id === id
    )
    if (!suggestion) return
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set
    nativeInputValueSetter?.call(inputRef.current, suggestion?.value)

    var event = new Event('input', { bubbles: true })
    inputRef.current.dispatchEvent(event)
    setShowSuggestions(false)
  }

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

  return (
    <div className='relative'>
      <input
        ref={inputRef}
        {...props}
        onFocus={() => setShowSuggestions(true)}
        onChange={onChange}
      />
      {showSuggestions && (
        <ul
          ref={suggestionsRef}
          className='shadow-md absolute top-[calc(100%+5px)] overflow-auto z-[60] bg-white scrollbar-thin list-none w-full border rounded-md max-h-52'
        >
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.value}
              onClick={() => onSuggestionClick(suggestion.id)}
              className='p-2 cursor-pointer hover:bg-gray-300 rounded-md'
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutoComplete
