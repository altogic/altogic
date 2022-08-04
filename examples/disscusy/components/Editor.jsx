import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

// import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from './EditorToolbar'
import 'react-quill/dist/quill.snow.css'
import { Controller } from 'react-hook-form'
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

export const Editor = ({ errors, name, control, onEditorStateChange }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    onEditorStateChange(value)
  }, [value])

  return (
    <div className='text-editor'>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={() => (
          <>
            <EditorToolbar />
            <ReactQuill
              theme='snow'
              value={value}
              onChange={setValue}
              placeholder='You can start typing the forum you want to start.'
              modules={modules}
              formats={formats}
              className={` border ${
                !errors
                  ? 'border-gray-300 focus:border-blue-300'
                  : 'border-red-300 focus:border-red-300'
              }  rounded-md shadow-sm`}
            />
          </>
        )}
      />
      {errors?.message && (
        <span className='inline-block text-sm text-red-600'>
          {errors.message.charAt(0).toUpperCase() + errors.message.slice(1)}
        </span>
      )}
    </div>
  )
}

export default Editor
