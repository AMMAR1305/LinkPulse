const mongoose = require('mongoose');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');

const getDashboardStats = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Core URL summary stats for the authenticated user.
  const summary = await Url.aggregate([
    {
      $match: {
        userId: userObjectId,
      },
    },
    {
      $group: {
        _id: null,
        totalUrls: { $sum: 1 },
        totalClicks: { $sum: '$clicks' },
        activeUrls: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
          },
        },
        expiredUrls: {
          $sum: {
            $cond: [{ $eq: ['$status', 'expired'] }, 1, 0],
          },
        },
      },
    },
  ]);

  const totals = summary[0] || {
    totalUrls: 0,
    totalClicks: 0,
    activeUrls: 0,
    expiredUrls: 0,
  };

  // Add disabledUrls count
  const disabledCount = await Url.countDocuments({
    userId: userObjectId,
    status: 'disabled',
  });
  totals.disabledUrls = disabledCount;

  const topUrlResult = await Url.aggregate([
    {
      $match: {
        userId: userObjectId,
      },
    },
    {
      $sort: {
        clicks: -1,
        createdAt: -1,
      },
    },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        id: '$_id',
        shortCode: 1,
        originalUrl: 1,
        clicks: 1,
      },
    },
  ]);

  const recentUrls = await Url.find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('_id shortCode clicks createdAt');

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayClicksResult = await Analytics.aggregate([
    {
      $match: {
        timestamp: { $gte: todayStart },
      },
    },
    {
      $lookup: {
        from: 'urls',
        localField: 'urlId',
        foreignField: '_id',
        as: 'url',
      },
    },
    {
      $unwind: '$url',
    },
    {
      $match: {
        'url.userId': userObjectId,
      },
    },
    {
      $count: 'clicks',
    },
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const clicksByDayResult = await Analytics.aggregate([
    {
      $match: {
        timestamp: { $gte: sevenDaysAgo },
      },
    },
    {
      $lookup: {
        from: 'urls',
        localField: 'urlId',
        foreignField: '_id',
        as: 'url',
      },
    },
    {
      $unwind: '$url',
    },
    {
      $match: {
        'url.userId': userObjectId,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$timestamp',
          },
        },
        clicks: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const clicksMap = new Map(
    clicksByDayResult.map((entry) => [entry._id, entry.clicks])
  );

  const clicksByDay = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: dateKey,
      clicks: clicksMap.get(dateKey) || 0,
    };
  });

  // Device, Browser, OS stats aggregation
  const deviceStatsResult = await Analytics.aggregate([
    {
      $lookup: {
        from: 'urls',
        localField: 'urlId',
        foreignField: '_id',
        as: 'url',
      },
    },
    { $unwind: '$url' },
    { $match: { 'url.userId': userObjectId } },
    { $group: { _id: '$device', count: { $sum: 1 } } },
  ]);

  const browserStatsResult = await Analytics.aggregate([
    {
      $lookup: {
        from: 'urls',
        localField: 'urlId',
        foreignField: '_id',
        as: 'url',
      },
    },
    { $unwind: '$url' },
    { $match: { 'url.userId': userObjectId } },
    { $group: { _id: '$browser', count: { $sum: 1 } } },
  ]);

  const osStatsResult = await Analytics.aggregate([
    {
      $lookup: {
        from: 'urls',
        localField: 'urlId',
        foreignField: '_id',
        as: 'url',
      },
    },
    { $unwind: '$url' },
    { $match: { 'url.userId': userObjectId } },
    { $group: { _id: '$os', count: { $sum: 1 } } },
  ]);

  const deviceStats = deviceStatsResult.reduce((acc, item) => {
    const key = (item._id || 'Unknown').toString();
    acc[key] = item.count;
    return acc;
  }, {});

  const browserStats = browserStatsResult.reduce((acc, item) => {
    const key = (item._id || 'Unknown').toString();
    acc[key] = item.count;
    return acc;
  }, {});

  const osStats = osStatsResult.reduce((acc, item) => {
    const key = (item._id || 'Unknown').toString();
    acc[key] = item.count;
    return acc;
  }, {});

  return {
    totalUrls: totals.totalUrls || 0,
    totalClicks: totals.totalClicks || 0,
    activeUrls: totals.activeUrls || 0,
    expiredUrls: totals.expiredUrls || 0,
    disabledUrls: totals.disabledUrls || 0,
    todayClicks: todayClicksResult[0]?.clicks || 0,
    topUrl: topUrlResult[0] || null,
    recentUrls,
    clicksByDay,
    deviceStats,
    browserStats,
    osStats,
  };
};

module.exports = {
  getDashboardStats,
};