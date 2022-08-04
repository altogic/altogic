export default function ForumDetailTag({ Tag, Index }) {
  const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-green-500', 'bg-blue-500', 'bg-brown-500']

  return (
    <div className='relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm mt-2 mr-2'>
      <span className='absolute flex-shrink-0 flex items-center justify-center'>
        <span className={`h-1.5 w-1.5 rounded-full ${colors[Index]}`} aria-hidden='true'></span>
      </span>
      <span className='ml-3.5 font-medium text-gray-900 cursor-default'>{Tag}</span>
    </div>
  )
}
