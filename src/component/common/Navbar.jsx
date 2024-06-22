import React from 'react'
import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import ProfileDropdown from "../core/auth/ProfileDropdown"

const Navbar = () => {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)
    const [loading, setLoading] = useState(false)
    
    const location = useLocation()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)

  }

  const subLinks = [
    {
      title: "Python",
      link: "/catalog/python",
    },
    {
      title: "javascript",
      link: "/catalog/javascript",
    },
    {
      title: "web-development",
      link: "/catalog/web-development",
    },
    {
      title: "Android Development",
      link: "/catalog/Android Development",
    },
  ];

  return (
    <div  className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}>

      <div className="flex w-11/12 max-w-maxContent items-center justify-between">

        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div></div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-x-4 items-center">
            {
                user && user?.accountType != "Instructor" && (
                    <Link to="/dashboard/cart" className="relative">
                        <AiOutlineShoppingCart />
                        {
                            totalItems > 0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }

            {
                token === null && (
                    <Link to="/login">
                        <button className='my-1 border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] 
                        text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button className='my- border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] 
                        text-richblack-100 rounded-md'>
                            Sign up
                        </button>
                    </Link>
                )
            }

            token !== null && (
                <ProfileDropdown />
            )
        </div>

      </div>
      
    </div>
  )
}

export default Navbar
