import { toast } from "sonner";

import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log(
      //   "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
      //   response
      // );

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      const user = await response?.data?.data?.profileData;
      const userImage =
        user.image ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;

      toast.success("Display Picture Updated Successfully");
      dispatch(setUser({ ...user, image: userImage }));

      localStorage.setItem("user", JSON.stringify(user));
      //console.log("Updated Profile Data: ", response.data.data.profileData);
    } catch (error) {
      //console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture");
    }
  };
}

export function updateProfile(token, formData) {
  //console.log("Token is: ", token);

  return async (dispatch) => {
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });
      //console.log("UPDATE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`;
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      );
      toast.success("Profile Updated Successfully");
    } catch (error) {
      //console.log("UPDATE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Update Profile");
    }
  };
}

export async function changePassword(token, passwordData) {
  try {
    const response = await apiConnector(
      "POST",
      CHANGE_PASSWORD_API,
      passwordData,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );
    //console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Changed Successfully");
  } catch (error) {
    //console.log("CHANGE_PASSWORD_API API ERROR............", error);
    toast.error(error.response.data.message);
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      //console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.info(
        "Profile Deleted Successfully. We've a great journey with you."
      );
      dispatch(logout(navigate));
    } catch (error) {
      //console.log("DELETE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Delete Profile");
    }
  };
}
