import Request from '../models/Request.js';

export const create = (data) => Request.create(data);

export const findById = (id) =>
  Request.findById(id)
    .populate('requester', 'fullName email skills reputation')
    .populate('helper', 'fullName email skills reputation');

export const findAll = ({ status, category, skill, page = 1, limit = 20 } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (skill) filter.skills = { $in: [skill] };

  const skip = (page - 1) * limit;
  return Request.find(filter)
    .populate('requester', 'fullName email reputation')
    .populate('helper', 'fullName email reputation')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countAll = ({ status, category, skill } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (skill) filter.skills = { $in: [skill] };
  return Request.countDocuments(filter);
};

export const findByRequester = (userId, page = 1, limit = 20) =>
  Request.find({ requester: userId })
    .populate('helper', 'fullName email reputation')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

export const findByHelper = (userId, page = 1, limit = 20) =>
  Request.find({ helper: userId })
    .populate('requester', 'fullName email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

export const updateById = (id, data) =>
  Request.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('requester', 'fullName email reputation')
    .populate('helper', 'fullName email reputation');

export const textSearch = (query, limit = 20) =>
  Request.find(
    { $text: { $search: query }, status: 'pending' },
    { score: { $meta: 'textScore' } }
  )
    .populate('requester', 'fullName email reputation')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);

export const findPendingBySkills = (skills, limit = 20) =>
  Request.find({ status: 'pending', skills: { $in: skills } })
    .populate('requester', 'fullName email reputation')
    .sort({ createdAt: -1 })
    .limit(limit);
