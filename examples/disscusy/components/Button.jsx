import React from 'react'
import { css } from '@emotion/react'
import ClipLoader from 'react-spinners/ClipLoader'
import PropTypes from 'prop-types'
const override = css`
  display: block;
  margin-inline: 0.5rem;
`

function Button({ label, className, loading, disabled, children, ...props }) {
  return (
    <button className={className} {...props} disabled={disabled}>
      {loading && <ClipLoader color='#fff' loading={loading} size={20} css={override} />}
      {children}
      <p className='mx-2'> {label}</p>
    </button>
  )
}
Button.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
}
Button.defaultProps = {
  label: '',
  className: '',
  loading: false,
  disabled: false,
  onClick: () => {},
  children: null,
}
export default Button
