import * as messageService from '../services/messageService.js';

export const getMessages = async (req, res, next) => {
  try {
    const data = await messageService.getMessages(req.params.requestId, req.user._id);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

export const sendMessage = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const data = await messageService.sendMessage(
      req.params.requestId, req.user._id, req.body.content, io
    );
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};
