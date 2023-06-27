const users = [];
usersonlie = [];

const usersjoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

const getroomuser = (room) => {
  return users.filter((user) => user.room === room);
};

const getuser = (id) => {
  return users.find((user) => user.id === id);
};

const leaveuser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return users.splice(index, 1)[0];
};

const useronline = (id) => {
  const user = users.find((user) => user.id === id);
  usersonline.push(user);
  return useronline;
};
const getonlineroomuser = (room) => {
  return useronline.filter((user) => user.room === room);
};

const useroffline = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return usersonline.splice(index, 1)[0];
};

module.exports = { usersjoin, getroomuser, getuser, leaveuser };
