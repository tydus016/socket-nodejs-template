import POST_TYPES from "./constants.js";
import post from "./directives.js";
import Logger from "./logger.js";

const Socket = (socket, io) => {
  socket.on("join_room", (post) => {
    // - validate request
    validate_request(io, post);

    const { room_name, request_type, endpoint, data } = post;

    socket.join(room_name);

    console.log("A user joined room:", room_name);

    // - WRITE ACCESS LOG
    const message = `---ROOM JOINED--- [ROOM NAME] : ${room_name}`;
    Logger(message, "access");

    if (["post", "get"].includes(request_type)) {
      if (request_type === POST_TYPES.get) {
        get_request(io, room_name, endpoint, data);
      } else {
        post_request(io, room_name, endpoint, data);
      }
    }
  });
};

const validate_request = (io, post) => {
  const { room_name, data } = post;
  if (
    room_name === "" ||
    room_name === null ||
    room_name === undefined ||
    data === "" ||
    data === null ||
    data === undefined
  ) {
    io.emit("general_message", {
      message: "Invalid request. Please try again.",
      status: false,
    });

    return false;
  }
};

const get_request = (io, room_name, endpoint, data) => {
  const params = {
    from_room: room_name,
    endpoint: endpoint,
    data: data,
  };

  //   - WRITE ACCESS LOG
  const message = `---GET REQUEST--- [PARAMS] ${JSON.stringify(params)}`;
  Logger(message, "access");

  post.get(params).then((res) => {
    const response = {
      ...res,
      room_name: params.from_room,
    };
    io.to(room_name).emit("get_requests", response);
  });
};

const post_request = (io, room_name, endpoint, data) => {
  const params = {
    from_room: room_name,
    endpoint: endpoint,
    data: data,
  };

  //   - WRITE ACCESS LOG
  const message = `---POST REQUEST--- [PARAMS] ${JSON.stringify(params)}`;
  Logger(message, "access");

  post.send(params).then((res) => {
    const response = {
      ...res,
      room_name: params.from_room,
    };
    io.to(room_name).emit("post_requests", response);
  });
};

export default Socket;
