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

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (authLoading || profileLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-start pt-24 justify-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Toggle Sidebar */}
      <div className="relative">
        {/* Sidebar */}
        {isSidebarVisible && (
          <div className="flex fixed md:relative z-[40] flex-col h-[calc(100vh-3.5rem)] min-w-[220px] py-5 justify-start border-r-[1px] border-r-richblack-700 md:bg-richblack-800 bg-slate-800 md:bg-opacity-100 bg-opacity-20 md:backdrop-blur-none backdrop-blur-md transition-all duration-300">
            <div className="flex justify-end w-full text-2xl">
              {/* Collapse Sidebar Button */}
              <MdOutlineArrowBackIos
                className="p-2 mr-3 text-3xl text-teal-500 rounded-full shadow-md cursor-pointer md:shadow-slate-950 shadow-slate-400 bg-slate-700 hover:bg-slate-800 hover:shadow-slate-600"
                onClick={() => setIsSidebarVisible(false)} // Collapse the sidebar
              />
            </div>
            <div className="flex flex-col mt-5">
              {sidebarLinks.map((link) => {
                if (link.type && user?.accountType !== link.type) return null;
                return (
                  <SidebarLink key={link.id} link={link} iconName={link.icon} />
                );
              })}
            </div>
            <div className="w-10/12 h-[1px] mx-auto mt-6 bg-cyan-900"></div>
            <div className="flex flex-col mt-4">
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
                className="px-8 py-2 text-sm font-medium text-teal-400 rounded-md hover:bg-pink-700 hover:text-slate-200"
              >
                <div className="flex flex-row gap-x-2">
                  <VscSignOut className="text-lg" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {!isSidebarVisible && (
          <div className="absolute top-4 left-2 z-[50]">
            <FaBars
              className="text-xl text-teal-500 cursor-pointer"
              onClick={() => setIsSidebarVisible(true)} // Expand the sidebar
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;
