import React from 'react'
import PropTypes from 'prop-types'
function Select({ options, id, error, register, className, ...props }) {
  return (
    <>
      <select
        id={id}
        {...register}
        className={` ${className} ${
          error && 'border-red-600 text-red-900 placeholder-red-300 focus:ring-red-600'
        }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option._id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
      {error?.message && (
        <span className='inline-block text-sm text-red-600'>
          {error.message.charAt(0).toUpperCase() + error.message.slice(1)}
        </span>
      )}
    </>
  )
}
Select.propTypes = {
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  onOptionClick: PropTypes.func,
}
Select.defaultProps = {
  className: '',
  onOptionClick: () => {},
}
export default Select
