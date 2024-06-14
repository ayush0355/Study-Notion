import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className="ml-2 font-bold  text-4xl  bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] inline-block text-transparent bg-clip-text">
        {" "}
        {text}
    </span>
  )
}

export default HighlightText
