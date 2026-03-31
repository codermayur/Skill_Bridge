import * as requestService from '../services/requestService.js';
import { findMatchingHelpers } from '../services/matchingService.js';

export const createRequest = async (req, res, next) => {
  try {
    const data = await requestService.createRequest({
      ...req.body,
      requesterId: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Request created', data });
  } catch (err) { next(err); }
};

export const getRequests = async (req, res, next) => {
  try {
    const { status, category, skill, page = 1, limit = 20, q } = req.query;

    if (q) {
      const data = await requestService.searchRequests(q);
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const result = await requestService.getRequests({
      status, category, skill,
      page: parseInt(page), limit: parseInt(limit),
    });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getRequestById = async (req, res, next) => {
  try {
    const data = await requestService.getRequestById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

export const updateRequest = async (req, res, next) => {
  try {
    const data = await requestService.updateRequest(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Request updated', data });
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const data = await requestService.updateStatus(
      req.params.id, req.body.status, req.user._id, req.user.role
    );
    res.status(200).json({ success: true, message: 'Status updated', data });
  } catch (err) { next(err); }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const data = await requestService.acceptRequest(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Request accepted', data });
  } catch (err) { next(err); }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const data = await requestService.getMyRequests(req.user._id, parseInt(req.query.page) || 1);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

export const getMyHelping = async (req, res, next) => {
  try {
    const data = await requestService.getMyHelping(req.user._id, parseInt(req.query.page) || 1);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

export const getMatchingHelpers = async (req, res, next) => {
  try {
    const request = await requestService.getRequestById(req.params.id);
    const matches = await findMatchingHelpers(request, 5);
    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (err) { next(err); }
};
