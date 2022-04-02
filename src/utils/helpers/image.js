import RestService from "utils/services/rest";

const isImageExisted = async (imageUrl) => {
  const result = await RestService.get(imageUrl);
  return result.success;
};

export { isImageExisted };
