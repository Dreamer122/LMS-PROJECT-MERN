import React from 'react'

 const HighlightedText = ({children}) => {
  return (
   <>
   <span className='text-blue-100 font-inter font-bold'>
{children}
   </span>
   </>
  )
}
export default HighlightedText
