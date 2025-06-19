import axios from "axios";

export const S3Service = {
  upload: async (file: File, url: string) => {
    await axios.put(url, file);
  },
};
