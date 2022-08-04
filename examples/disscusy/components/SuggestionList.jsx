import { Popover } from '@headlessui/react'
const SuggestionsList = ({ filteredSuggestions, onClick, formatResult }) => {
  return (
    <>
      <hr className='border-gray-100 m-auto w-11/12' />
      <ul className='suggestions bg-white border border-gray-100 border-t-0 list-none mt-0 overflow-y-auto pl-0 w-full'>
        {filteredSuggestions.length ? (
          filteredSuggestions.map((suggestion, index) => {
            return (
              <Popover.Button
                key={index}
                onClick={(e) => onClick(e, suggestion._id)}
                className='w-full'
              >
                <li className='hover:cursor-pointer hover:text-slate-300 hover:bg-gray-100'>
                  {formatResult ? formatResult(suggestion) : suggestion.name}
                </li>
              </Popover.Button>
            )
          })
        ) : (
          <li className='hover:cursor-pointer p-2'>No results found</li>
        )}
      </ul>
    </>
  )
}
export default SuggestionsList
