import { MdClose } from "react-icons/md";

const CustomCloseButton = ({ closeToast }) => (
  <MdClose
    onClick={closeToast}
    style={{ color: "#ffffff", cursor: "pointer" }} // Custom color
  />
);

export default CustomCloseButton;
