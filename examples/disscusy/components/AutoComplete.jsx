import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SuggestionsList from './SuggestionList'
import { SearchIcon, XIcon } from '@heroicons/react/outline'
import { DebounceInput } from 'react-debounce-input'
import { useRouter } from 'next/router'
const AutoComplete = ({ suggestions, onSearch, formatResult, loading, closeModal, ...rest }) => {
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState('')
  const router = useRouter()
  const onChange = async (e) => {
    setInput(e.target.value)
    onSearch(e.target.value)
    setActiveSuggestionIndex(0)
    setShowSuggestions(true)
  }
  const onClick = (e, suggestionId) => {
    setInput(e.target.innerText)
    closeSuggestions()
    router.push(`/forum-detail?id=${suggestionId}`)
  }
  const onKeyDown = (key) => {
    if (key.keyCode === 13 || key.keyCode === 9) {
      setInput(suggestions[activeSuggestionIndex].name)
    }
  }
  const closeSuggestions = () => {
    setShowSuggestions(false)
    setActiveSuggestionIndex(0)
    setInput('')
    if (closeModal) {
      closeModal()
    }
  }
  useEffect(() => {
    document.body.addEventListener('click', () => closeSuggestions())
    return () => document.body.removeEventListener('click', () => closeSuggestions())
  }, [])

  return (
    <div className='relative h-11'>
      <div className='wrapper w-full absolute flex flex-col border border-solid border-gray-300 rounded-md bg-white text-gray-800 fontFamily-Inter z-0 '>
        <div className='flex items-center h-11 w-full rounded-lg bg-white shadow-sm text-color-gray-700 font-base fontFamily-Inter placeholder-gray-500 indent-6 focus:ring-0 focus:outline-none focus:ring-gray-300 focus:border-gray-300'>
          <SearchIcon className='w-5 h-5 text-slate-400 absolute left-2 top-3' />
          <DebounceInput
            type='text'
            value={input}
            className='w-full h-full outline-none rounded-md border-none p-0 m-0 bg-white indent-8 focus:shadow-none'
            onChange={onChange}
            onKeyDown={onKeyDown}
            debounceTimeout={700}
            {...rest}
          />
          {input && (
            <XIcon
              className='w-5 h-5 text-slate-400 absolute right-2 top-3 cursor-pointer'
              onClick={() => setInput('')}
            />
          )}
        </div>
        {showSuggestions && input && !loading && (
          <SuggestionsList
            filteredSuggestions={suggestions}
            activeSuggestionIndex={activeSuggestionIndex}
            onClick={onClick}
            formatResult={formatResult}
          />
        )}
      </div>
    </div>
  )
}
AutoComplete.propTypes = {
  suggestions: PropTypes.array,
  onSearch: PropTypes.func,
  formatResult: PropTypes.func,
}
AutoComplete.defaultProps = {
  suggestions: [],
  onSearch: () => {},
  formatResult: () => {},
}
export default AutoComplete
