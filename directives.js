import axios from "axios";

const Post = () => {
  return {
    send: async (params) => {
      const { endpoint, data } = params;

      const headers = {
        "Content-Type": "application/json", // Adjust content type if needed
      };
      return axios
        .post(endpoint, data, headers)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log("error sending post", err);
        });
    },
    get: async (params) => {
      const { endpoint, data } = params;

      return axios
        .get(endpoint)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log("err get axios", err);
        });
    },
  };
};

const post = Post();

export default post;
