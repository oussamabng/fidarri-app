import axios from "axios";

export const uploadFile = async (uri, type, fileName) => {
  const newUri = "file:///" + uri.split("file:/").join("");

  const formData = new FormData();
  formData.append("image", {
    uri: newUri,
    type,
    name: fileName,
  });

  try {
    const response = await axios.post(
      "https://api.fidarri.com/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
