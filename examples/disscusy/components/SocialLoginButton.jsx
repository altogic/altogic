import Icons from '@/constants/Icons'

const SocialLoginButton = ({ Icon, onClick }) => {
  return (
    <div>
      <a
        className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-gray-50 cursor-pointer'
        onClick={onClick}
      >
        <span className='sr-only'>Sign in with {Icon}</span>
        <svg
          className='w-5 h-5'
          aria-hidden={Icons[Icon].ariaHidden}
          fill={Icons[Icon].fill}
          viewBox={Icons[Icon].viewBox}
        >
          <path fillRule={Icons[Icon].fillRule} d={Icons[Icon].d} clipRule={Icons[Icon].clipRule} />
        </svg>
      </a>
    </div>
  )
}

export default SocialLoginButton
