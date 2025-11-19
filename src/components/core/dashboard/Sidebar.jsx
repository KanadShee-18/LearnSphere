import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";
import { logout } from "../../../services/operations/authAPI";
import { FaBars } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";

const Sidebar = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (authLoading || profileLoading) {
    return (
      <div className='grid h-screen min-w-[220px] items-start pt-24 justify-center border-r-[1px] border-r-richblack-700 bg-richblack-800'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className='relative h-screen'>
        {/* Sidebar */}
        <div
          className={`flex top-0 left-0 fixed md:relative z-[40] flex-col h-screen min-w-[220px] justify-start pt-6 border-r-[1px]  border-r-richblack-700 md:bg-richblack-800 bg-slate-800 md:bg-opacity-100 bg-opacity-20 md:backdrop-blur-none backdrop-blur-md transition-transform duration-300 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className='relative flex justify-end w-full text-2xl group'>
            {/* Collapse Sidebar Button */}
            <MdOutlineArrowBackIos
              className='p-2 mr-3 text-3xl text-teal-500 rounded-full shadow-md cursor-pointer md:shadow-slate-950 shadow-slate-400 bg-slate-700 hover:bg-slate-800 hover:shadow-slate-600'
              onClick={() => setIsSidebarVisible(false)}
            />
            <p className='absolute invisible text-nowrap text-[10px] font-normal px-1 rounded-md group-hover:visible -top-3 -right-10 bg-slate-500 bg-opacity-30'>
              Collapse
            </p>
          </div>
          <div className='flex flex-col mt-5'>
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;
              return (
                <SidebarLink key={link.id} link={link} iconName={link.icon} />
              );
            })}
          </div>
          <div className='w-10/12 h-[1px] mx-auto mt-6 bg-cyan-900'></div>
          <div className='flex flex-col mt-4'>
            <SidebarLink
              link={{ name: "Settings", path: "dashboard/settings" }}
              iconName={"VscSettingsGear"}
            />
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you sure?",
                  text2: "You'll be logged out of your account.",
                  btn1Text: "Logout",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(logout(navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className='px-8 py-2 text-sm font-medium text-teal-400 rounded-md hover:bg-pink-700 hover:text-slate-200'
            >
              <div className='flex flex-row gap-x-2'>
                <VscSignOut className='text-lg' />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>

        {!isSidebarVisible && (
          <div className='fixed group top-16 left-2 z-[50] p-2 bg-slate-800 rounded-lg'>
            <FaBars
              className='text-xl text-teal-500 cursor-pointer '
              onClick={() => setIsSidebarVisible(true)} // Expand the sidebar
            />
            <p className='absolute invisible text-nowrap text-[10px] font-normal px-1 rounded-md group-hover:visible -bottom-6 -right-7 bg-slate-500 bg-opacity-30'>
              Expand
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;
