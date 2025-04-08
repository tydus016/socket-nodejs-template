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

  socket.on("leave_room", (room_leave_data) => {
    const { room_name } = room_leave_data;

    // - leave the room provided
    socket.leave(room_name);

    // - WRITE ACCESS LOG
    const message = `---ROOM LEFT--- [ROOM NAME] : ${room_name}`;
    Logger(message, "access");
  });

  socket.on("disconnect", (socket) => {
    const message = `---SOCKET DISCONNECTION---`;
    Logger(message, "access");
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

  socket.on("custom_event", (event_data) => {
    const { room_name, event_name, send_to_room = false, data } = event_data;

    if (send_to_room) {
      io.to(room_name).emit(event_name, data);
    } else {
      io.emit(event_name, data);
    }

    Logger("custom_event : " + JSON.stringify(event_data), "access");
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
  let message = `---POST REQUEST--- [PARAMS] ${JSON.stringify(params)}`;
  Logger(message, "access");

  post.send(params).then((res) => {
    if (res) {
      const response = {
        ...res.data,
        room_name: params.from_room,
      };

      io.to(room_name).emit("post_requests", response);

      let message = `---POST REQUEST--- [RESPONSE] ${JSON.stringify(response)}`;
      Logger(message, "access");
    }
  });
};

export default Socket;
