const model = require('../models/friends.model');

const sendRequest = async (req, res) => {
  try {
    const { fromUserId, toUserEmail } = req.body;
    await model.sendRequest(fromUserId, toUserEmail);
    res.json({ message: 'Solicitud enviada' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const respondRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    await model.respondRequest(requestId, status);
    res.json({ message: `Solicitud ${status}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFriends = async (req, res) => {
  const { userId } = req.params;
  const friends = await model.getFriendsList(userId);
  res.json(friends);
};

const getPending = async (req, res) => {
  const { userId } = req.params;
  const pending = await model.getPendingRequests(userId);
  res.json(pending);
};

module.exports = {
  sendRequest,
  respondRequest,
  getFriends,
  getPending
};