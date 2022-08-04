import React from 'react'
import fileService from '@/services/file'
import hljs from 'highlight.js'
// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox='0 0 18 18'>
    <polygon className='ql-fill ql-stroke' points='6 10 4 12 2 10 6 10' />
    <path className='ql-stroke' d='M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9' />
  </svg>
)

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox='0 0 18 18'>
    <polygon className='ql-fill ql-stroke' points='12 10 14 12 16 10 12 10' />
    <path className='ql-stroke' d='M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5' />
  </svg>
)

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo()
}
function redoChange() {
  this.quill.history.redo()
}
function imageHandler() {
  const input = document.createElement('input')

  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    var file = input.files[0]
    const range = this.quill.getSelection()
    const position = range ? range.index : 0
    this.quill.insertText(position, 'Uploading Image. Please wait...', {
      size: '2rem',
    })
    const res = await uploadImage(file, this.quill)

    this.quill.insertEmbed(range.index, 'image', res)
    this.quill.deleteText(position + 1, 31)
  }
}
const uploadImage = async (file) => {
  const { data } = await fileService.uploadFile(file, file.name)
  return data.publicPath
}
// Modules object for setting up the Quill editor
export const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  clipboard: {
    matchVisual: false,
  },
  toolbar: {
    container: '#toolbar',
    handlers: {
      undo: undoChange,
      redo: redoChange,
      image: imageHandler,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
}

// Formats objects for setting up the Quill editor
export const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'script',
  'blockquote',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'code-block',
]

// Quill Toolbar component
export const QuillToolbar = () => {
  if (typeof window !== 'undefined') {
    const pickerLabels = document.getElementsByClassName('ql-picker-label')
    Array.from(pickerLabels).forEach((l) => (l.tabIndex = -1))
  }

  return (
    <div id='toolbar' className='bg-slate-50 mb-2'>
      <span className='ql-formats'>
        <button className='ql-bold' tabIndex={-1} />
        <button tabIndex={-1} className='ql-italic' />
        <button tabIndex={-1} className='ql-underline' />
        <button tabIndex={-1} className='ql-strike' />
      </span>
      <span className='ql-formats'>
        <button tabIndex={-1} className='ql-list' value='ordered' />
        <button tabIndex={-1} className='ql-list' value='bullet' />
        <button tabIndex={-1} className='ql-indent' value='-1' />
        <button tabIndex={-1} className='ql-indent' value='+1' />
      </span>
      <span className='ql-formats'>
        <button tabIndex={-1} className='ql-script' value='super' />
        <button tabIndex={-1} className='ql-script' value='sub' />
        <button tabIndex={-1} className='ql-blockquote' />
        <button tabIndex={-1} className='ql-direction' />
      </span>
      <span className='ql-formats'>
        <select className='ql-align' />
        <select className='ql-color' />
        <select className='ql-background' />
      </span>
      <span className='ql-formats'>
        <button tabIndex={-1} className='ql-link' />
        <button tabIndex={-1} className='ql-image' />
        <button tabIndex={-1} className='ql-video' />
      </span>
      <span className='ql-formats'>
        <button tabIndex={-1} className='ql-formula' />
        <button tabIndex={-1} className='ql-code-block' />
        <button tabIndex={-1} className='ql-clean' />
      </span>
      <span className='ql-formats'>
        <button tabIndex={-1} className='ql-undo'>
          <CustomUndo />
        </button>
        <button tabIndex={-1} className='ql-redo'>
          <CustomRedo />
        </button>
      </span>
    </div>
  )
}

export default QuillToolbar
