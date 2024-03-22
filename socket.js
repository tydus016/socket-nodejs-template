import post from "./directives.js";
import Logger from "./logger.js";

const Socket = (socket, io) => {
  socket.on("join_room", (room_join_data) => {
    const { room_name } = room_join_data;

    // - join the room provided
    socket.join(room_name);

    // - WRITE ACCESS LOG
    const message = `---ROOM JOINED--- [ROOM NAME] : ${room_name}`;
    Logger(message, "access");

    initIO(socket, io);
  });
};

const initIO = (socket, io) => {
  console.log("initIO");
  socket.on("post_request", (post_data) => {
    const { room_name, endpoint, data } = post_data;

    post_request(io, room_name, endpoint, data);
  });

  socket.on("get_request", (get_data) => {
    const { room_name, endpoint, data } = get_data;

    get_request(io, room_name, endpoint, data);
  });
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
