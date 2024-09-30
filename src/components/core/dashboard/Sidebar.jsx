import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinnner from "../../common/Spinner";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";
import { logout } from "../../../services/operations/authAPI";

const Sidebar = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);

  if (authLoading || profileLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-start pt-24 justify-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <Spinnner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] min-w-[220px] py-10 justify-start border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="flex flex-col">
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
            className="px-8 py-2 text-sm font-medium text-teal-700 rounded-md hover:bg-pink-700 hover:text-slate-200"
          >
            <div className="flex flex-row gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default Sidebar;
