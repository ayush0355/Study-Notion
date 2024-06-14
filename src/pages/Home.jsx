import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from "../component/core/HomePage/HighlightText"
import CTAButton from '../component/core/HomePage/CTAButton'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../component/core/HomePage/CodeBlocks'
import TimelineSection from '../component/core/HomePage/TimelineSection'
import LearningLanguageSection from '../component/core/HomePage/LearningLanguageSection'
import InstructorSection from "../component/core/HomePage/InstructorSection"
import Footer from "../component/common/Footer"
import ExploreMore from '../component/core/HomePage/ExploreMore'

const Home = () => {
  return (
    <div>
      {/*Section 1 */}
        <div className='relative  mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between '>
            <Link to={"/signup"}>
                <div className='group mx-auto mt-16 p-1 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all 
                                duration-200 hover:scale-95 w-fit shadow-[inset_0px_-0.5px_0px_0px_#FFFFFF]'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200
                                    group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>
            </Link>

            <div className=' text-3xl text-center font-semibold mt-7 '>
                Empower Your Future with
                <HighlightText text={"Coding Skills"} /> 
            </div>


            <div className="w-[90%] text-center text-lg font-bold text-richblack-300 mt-4">
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>


            <div className='flex flex-row gap-7 mt-8'>

                <CTAButton active={true} linkto={"/signup"}>
                  Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}>
                  Book a Demo
                </CTAButton>


            </div>

            <div className=' mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200 '>
              
              <video muted loop autoPlay className=' h-[80vh] shadow-[20px_20px_rgba(255,255,255)] '>
                <source src={Banner} type='video/mp4'>

                </source>
              </video>

              

            </div>

            {/*Code section 1 */}

            <div>
              <CodeBlocks 
                position={"lg:flex-row"}
                heading={
                  <div className='text-4xl font-semi-bold'>
                    Unlock Your
                    <HighlightText text={"coding potential "} />
                    <span>{" "}</span> with our online courses
                  </div>
                }
                subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you. "}

                ctabtn1={
                  {
                    btnText: "Try it Yourself",
                    linkto:"/signup",
                    active:true,
                  }
                }
                ctabtn2={
                  {
                    btnText: "Learn More",
                    linkto:"/login",
                    active:false,
                  }
                }
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                codeColor={"text-yellow-25"}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
              />
            </div>

            {/*Code section 2 */}

            <div>
              <CodeBlocks 
                position={"lg:flex-row-reverse"}
                heading={
                  <div className='w-[100%] lg:w-[50%]  text-4xl font-semi-bold'>
                    Start
                    <span>
                    <HighlightText text={"coding in seconds "} />
                    </span>
                    
                    
                  </div>
                }
                subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson. "}

                 ctabtn1={
                  {
                    btnText: "Continue Lesson",
                    linkto:"/signup",
                    active:true,
                  }
                }
                ctabtn2={
                  {
                    btnText: "Learn More",
                    linkto:"/login",
                    active:false,
                  }
                }
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                codeColor={"text-white"}
                backgroundGradient={<div className="codeblock2 absolute"></div>}
              />
            </div>

            <ExploreMore />

        </div>


      {/*Section 2 */}
      
      <div className='bg-pure-greys-5 text-richblack-700 '>
              <div className='homepage_bg h-[310px]'>
                <div className='w-[11/12] max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                  <div className='h-[150px]'></div>
                  <div className='flex flex-row gap-7 text-white'>
                    <CTAButton active={true} linkto={"/signup"}  >
                      <div className='flex items-center gap-3'>Explore Full Catalog <FaArrowRight /> </div>
                      
                    </CTAButton>

                    <CTAButton active={false} linkto={"/signup"} >
                      <div>Learn More</div>
                    </CTAButton>
                  </div>

                </div>
              </div>

              <div className='w-[11/12] mx-auto max-w-maxContent flex flex-col items-center justify-between gap-7'>

                <div className='flex flex-row gap-5 w-[100%] mb-10 mt-[95px]'>
                  <div className='text-4xl font-semibold w-[45%] '>Get the skills you need for a
                    <HighlightText text={"Job that is in demand"}/>
                  </div>

                  <div className='flex flex-col gap-10 w-[40%] items-start '>
                  <p className='text-[16px]'>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>

                  <CTAButton active={true} linkto={"/signup"} >
                    <div>Learn More</div>
                  </CTAButton>

                </div>

                </div>

                
                <TimelineSection />

                <LearningLanguageSection />
              
              </div>

              
              
      </div>
      
      
      {/*Section 3 */}
      <div className="w-[11/12] mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white" >

            <InstructorSection />

            <h2 className='text-center text-4xl font-semibold mt-10'>review from Other Learners</h2>

          <div>

          </div>

      </div>
      
      
      {/*Section footer */} 

      <Footer />           
    </div>
  )
}

export default Home
        