import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {getPasswordResetToken} from "../services/operations/authAPI"
import { FaArrowLeftLong } from "react-icons/fa6";

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [email,setEmail] = useState("");
    const dispatch = useDispatch(); 
    const loading = useSelector((state)=> state.auth.loading);


    const handleOnSubmit = (e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent))
    }
  return (
    <div className='text-white flex justify-center items-center'>
      {
        loading ? (
            <div className='spinner'></div>
        ) : 
        (
            <div className='flex h-screen justify-center items-start flex-col max-w-[380px] my-auto'>
                <h1 className='text-richblack-5 text-2xl'>
                    {
                        !emailSent ? "Reset your Password" : "Check your Email"
                    }
                </h1>
                <p className='text-richblack-200 text-[16px] mt-2 mb-7'>
                    {
                        !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                        : 
                        `We have sent the reset email to ${email}`
                    }
                </p>

                <form onSubmit={handleOnSubmit}>
                    {
                        !emailSent && (
                            <label className=' w-[380px]'><p className='text[0.800rem] text-richblack-5 mb-1 leading-[1.375rem] '>Email Address {<sup className='text-pink-200'>*</sup>}</p>
                            <input
                                required
                                type='text'
                                name='email'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder='Enter your Email Address' 
                                className='appearance-none bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b border-richblack-300' 
                                />
                            </label>
                        )
                    }

                    <button type='submit'
                    className='w-full bg-yellow-50 rounded-[8px] font-semibold text-richblack-800 px-[12px] py-[8px] mt-5 hover:text-richblack-900 hover:scale-95 transition-all duration-200 '>
                        {
                            emailSent ? "Resend Email" : "Reset Password"
                        }
                    </button>

                    <div>
                        <Link to="/login">
                            <div className='flex flex-row text-richblack-5 gap-2 items-center mt-2'>
                                <FaArrowLeftLong />
                                <p>Back to login</p>
                            </div>
                        </Link>
                    </div>
                </form>
            </div>
        )
      }
    </div>
  )
}

export default ForgotPassword
