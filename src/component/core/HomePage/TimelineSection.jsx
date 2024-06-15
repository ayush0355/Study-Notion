import React from 'react'

import logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"


const timeline = [
    {
        logo:logo1,
        heading:"Leadership",
        Description:"Fully commited to the success company"
    },
    {
        logo:logo2,
        heading:"Responsibility",
        Description:"Students will always be our top priority"
    },
    {
        logo:logo3,
        heading:"Flexibility",
        Description:"The ability to switch is an important skill"
    },
    {
        logo:logo4,
        heading:"Solve the problem",
        Description:"Code your way to a solution"
    },
]

const TimelineSection = () => {
  return (
    <div >
      <div className='flex  flex-col lg:flex-row justify-center items-center gap-20 mb-20 '>

        <div className='lg:w-[45%] flex flex-col gap-14 lg:gap-7'>
            {
                timeline.map((element,index)=>{
                    return (
                        <div className='flex flex-col lg:gap-3 ' key={index}>

                            <div className='flex gap-6' key={index}>
                                <div className='w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]'>
                                    <img src={element.logo} loading='lazy' alt='imageLogo'></img>
                                </div>

                                <div className=''>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>
                            </div>

                        </div>
                    )
                })
            }
        </div>

        <div className=" w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          
          <div className=''>
          <img
            src={timelineImage}
            alt="timelineImage"
            className="   shadow-white shadow-[20px_20px_0px_0px]  "
          />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineSection
