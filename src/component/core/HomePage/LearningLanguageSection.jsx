import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div  >
      <div className='flex flex-col gap-5'>

        <div className='text-4xl font-semibold text-center my-10'>
          Your Swiss Knife for
          <HighlightText text={"learning any language"} />
        </div>

        <div className='text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base '>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>


        <div className=" flex flex-col lg:flex-row overflow-hidden  mt-8 lg:mt-0">
          <img src={know_your_progress} 
            alt="Know your progress"
            className='object-cover  lg:-mr-32'
          />

          <img src={compare_with_others}
            alt="Compare with others"
            className="object-cover lg:-mb-10 lg:-mt-0 -mt-12"
          />

          <img src={plan_your_lessons} 
            alt="Plan your lessons"
            className="object-cover  lg:-ml-36 lg:-mt-5 -mt-16"
          />
        </div>


        <div className='w-fit mx-auto lg:mb-14 mb-8 mt-14'>
          <CTAButton active={true} linkto={"/signup"}>
            <div>
              Learn More
            </div>
          </CTAButton>
        </div>

      </div>
    </div>
  )
}

export default LearningLanguageSection
