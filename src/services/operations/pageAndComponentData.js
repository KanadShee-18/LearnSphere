import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";
import { toast } from "sonner";

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading ...");
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    );

    if (!response?.data?.success) {
      throw new Error("Not able to fetch category page data.");
    }

    result = response?.data;
    // console.log("Catalog Page data comes as: ", result);
  } catch (error) {
    // console.log("CATALOG PAGE DATA API ERROR.....", error);
    toast.error(error.response?.data.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
