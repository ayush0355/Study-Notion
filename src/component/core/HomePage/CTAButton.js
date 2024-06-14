import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>
        <div className={`shadow-[inset_-1px_-1px_0.2px_0.4px_#999DAA] text-center text-[13px] px-6 py-3 rounded-md font-bold 
                        ${active ? "bg-yellow-50 text-black" : "bg-richblack-800 "}
                        hover:scale-95  transition-all duration-200
                        ${active ? "hover:bg-yellow-25" : "hover:bg-richblack-700"} `}>
            {children}  
        </div>
    </Link>
  )
}

export default CTAButton
