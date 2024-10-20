import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import IconBtn from "../../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI";
import Spinner from "../../../common/Spinner";

const ChangeProfilePicture = () => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(null);

    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            previewFile(file);
        }
    };

    const handleFileUpload = () => {
        try {
            console.log("Uploading image...");
            setLoading(true);
            const formData = new FormData();
            formData.append("displayPicture", imageFile);
            console.log("Form data:", formData);
            dispatch(updateDisplayPicture(token, formData)).then(() => {
                setLoading(false);
            });
        } catch (error) {
            console.log("Error message while file uploading: ", error.message);
        }
    };

    return (
        <div>
            <div className="relative flex flex-row justify-between w-10/12 max-w-[1000px] p-7 mx-auto rounded-lg text-slate-200 bg-[#28344d] border-[1px] border-[#4d4d66]">
                <div className="flex flex-row items-center justify-start gap-x-5">
                    <img
                        src={previewSource || user?.image}
                        alt=""
                        className="aspect-square rounded-full w-[84px] object-cover hover:scale-110 transition-all duration-300 cursor-pointer hover:opacity-95 border-[5px] border-[#2d98fc]"
                    />
                    <div className="space-y-2">
                        <p>
                            Change Profile Picture{" "}
                            <span className="text-sm text-teal-600">
                                (&lt;1mb)
                            </span>
                        </p>
                        <div className="flex flex-row gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/gif, image/jpeg"
                            />
                            <button
                                onClick={handleClick}
                                disabled={loading}
                                className="px-5 py-2 font-semibold bg-teal-500 rounded-md cursor-pointer hover:bg-teal-600 hover:text-slate-100 text-slate-700"
                            >
                                Select
                            </button>
                            <IconBtn
                                text={loading ? "Uploading..." : "Upload"}
                                onclick={handleFileUpload}
                                customClasses={
                                    "px-2 h-fit py-2 bg-slate-500 my-auto rounded-md text-slate-800 font-semibold hover:bg-slate-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm group"
                                }
                            >
                                {!loading && (
                                    <FiUpload className="text-lg font-semibold text-richblack-800 group-hover:scale-110 group-hover:text-slate-100" />
                                )}
                            </IconBtn>
                            {loading && (
                                <div className="w-[100px] h-auto flex items-center justify-start ml-3">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeProfilePicture;
