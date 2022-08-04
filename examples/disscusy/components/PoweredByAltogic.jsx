const PoweredByAltogic = () => {
  return (
    <a
      href='https://www.altogic.com'
      className='whitespace-nowrap mr-5 mb-5 fixed z-50 bottom-0 right-0 text-xs inline-flex items-center justify-center px-2 py-2 border border-transparent rounded-md shadow-xl bg-[#3b81f6] cursor-pointer text-white'
    >
      <img className='h-5 mr-2' src='/altogic-powered.svg' alt='' />
      Powered by&nbsp;
      <span className='text-slate-100 cursor-pointer' href='https://www.altogic.com'>
        Altogic
      </span>
    </a>
  )
}

export default PoweredByAltogic
