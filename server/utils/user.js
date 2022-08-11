const users = [];

export const addUser = ({ id, username, roomId }) => {
  const index = users.findIndex((user) => {
    user.id === id;
  });

  if (index !== -1) {
    return { error: "Username is taken" };
  }
  const user = { id, username, roomId };

  users.push(user);
  return;
};

export const removeUser = (id) => {
  const index = users.findIndex((user) => {
    user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id) => users.find((user) => user.id === id);

export const getUsersInRoom = (roomId) =>
  users.filter((user) => user.roomId === roomId);
