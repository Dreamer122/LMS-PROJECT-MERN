import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Small-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../services/apiConnector'
import {AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { categories } from '../../services/apis'

import ProfileDropDown from "../core/Auth/ProfileDropDown"
export const Navbar = () => {
    const [catlist,setCatlist]=useState("")
    const{user}=useSelector((state)=>state.profile);
    const {token}=useSelector((state)=>state.auth);
    const {totalItems}=useSelector((state)=>state.cart);

    console.log("userdata=",user)
    const fetchData=async()=>{
        // console.log(Base_url)
      const result =await apiConnector("get",`${categories.CATEGORIES_API}`)
      console.log(result.data.data);
      setCatlist(result.data.data)
    }
    useEffect(()=>{
        fetchData();
    },[])

  return (
    <div className='flex gap-4 text-richblack-5 justify-around py-5'>
        <div>
            {/* logoi */}
                <img src={logo} alt="logo" />
        </div>
        <nav>
{/* list  */}
<ul className='flex gap-5'>
    {
        NavbarLinks.map((ele,index)=>{
            return (
                <li key={index}>
                    {
                        ele.title!="Catalog"?<Link to={ele.path}>{ele.title}</Link>:
                        <div className='group'>
                            <p className='flex gap-1'>{ele.title} <IoIosArrowDropdownCircle className='relative top-1' />
                            </p>
                            <div className='bg-richblack-25 text-richblack-800 invisible group-hover:visible'>
                               <ul>
                                {
                                   catlist&&catlist?.map((cat, index) => {
                                        return (
                                        <li key={cat._id}>    <Link key={index} to={`/catalog/${cat.name}`} className='text-richblack-
                                            5 hover:text-richblack-1'>{cat.name}</Link> </li>
                                            )
                                        })
                                }
                                  </ul>
                            </div>

                        </div>
                    }
                </li>
            )

        })
    }

</ul>
        </nav>
        <div className='flex gap-3'>
            {/* buttons  */}
            {
                token && token!=null?
                "":
                <Link to={"/login"}> 
                <button  className='bg-richblack-700 text-richblack-400 border-richblack-400 p-3'>logIn </button>
                </Link>
            }
            {
                token && token!=null?
               "":
               <Link to="/signup"> 
               <button className='bg-richblack-700 text-richblack-400 border-richblack-400 p-3'>signup </button>
               </Link>
            }
            {
                user && user.accountType != "Instructor" ? (
                    <Link to="/dashboard/cart" className='relative'>
                      <span className='text-richblack-5'> 
                    <AiOutlineShoppingCart/>
                      </span>
                        {
                            totalItems > 0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                ):""
            }
            {
               
             token !== null && <ProfileDropDown />
            //  token !== null && <img src={user?.image} alt="userinitials" />

            }
        </div>
    </div>
  )
}
