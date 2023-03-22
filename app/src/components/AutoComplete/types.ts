type suggestion = {
  id: string
  value: string
  [key: string]: any
}

export interface TextInputWithAutoCompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  suggestions: suggestion[]
  filterSuggestions?: (suggestions: suggestion[], value: string) => suggestion[]
  onChange?: (suggestion: suggestion) => void
  clearOnSelect?: boolean
}
