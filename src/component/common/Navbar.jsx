import React, { useEffect } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import  ProfileDropdown from "../core/auth/ProfileDropdown"
import {useState} from 'react'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { IoIosArrowDown } from 'react-icons/io'

const subLinks = [
    {
        title:"python",
        link: "/catalog/python"
    },
    {
        title:"Web-Dev",
        link: "/catalog/web-devlopment"
    },
]

const Navbar = () => {
    const location = useLocation();
    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=> state.profile);
    const {totalItems} = useSelector((state)=> state.cart);
    
    //const {subLinks, setSubLinks} = useState([]);
    

    // const fetchSubLinks = async() =>{
    //     try{
    //         const result = await apiConnector("GET",categories.CATEGORIES_API);
    //         console.log("Printing sublinks : ", result);
    //         setSubLinks(result.data.data);
    //     }catch(err){
    //         console.log("Could not fetch category list");
    //     }
    // }

    useEffect(()=>{
       // fetchSubLinks();
    },[])


    const matchRoute = (route)=>{
        return matchPath({path:route}, location.pathname)
    }

  return (
    <div className=' flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className="w-11/12 flex flex-row justify-between items-center    ">

            <Link to="/">
                <img src={logo} alt="logo" width={160} height={42} />
            </Link>

            <nav>
                <ul className="flex  gap-x-6 text-richblack-25">
                    {
                        NavbarLinks.map((link,index)=>(
                             <li key={index}>
                                {
                                    link.title === "Catalog" ? (
                                    <div className="flex  items-center gap-1 group">
                                        <p>{link.title}</p>
                                        <IoIosArrowDown />

                                        <div className='lg:w-[300px] invisible absolute left-[50%] translate-x-[-50%] translate-y-[7%] top-[7%] flex flex-col rounded-md bg-richblack-5 py-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible 
                                        group-hover:opacity-100'>

                                        </div>
                                    </div>) :
                                    (
                                        <Link to={link?.path}>
                                            <p 
                                            className={`
                                            ${matchRoute(link?.path) ?"text-yellow-25" : "text-richblack-25"}
                                            `}
                                            >{link.title}</p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>


            <div className ="flex gap-x-4 items-center">
                
                {
                    user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className='relative'>
                                <AiOutlineShoppingCart />
                                {
                                    totalItems > 0 && (
                                        <span>{totalItems}</span>
                                    )
                                }
                            </Link>
                        
                    )
                }
                {
                    token === null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[14px] py-[8px] text-richblack-100 rounded-md'>
                                Log in
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-[14px] py-[8px] text-richblack-100 rounded-md'>
                                Sign up
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && (
                        <ProfileDropdown />
                    ) 
                }

            </div>

        </div>
    </div>
  )
}

export default Navbar
