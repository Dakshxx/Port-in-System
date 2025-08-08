exports.filterQuery = (params) => {
  const query = {};
  const { msisdn, zone, lsa, status, dateFrom, dateTo, page = 1, limit = 10 } = params;

  if (msisdn) query.msisdn = msisdn;
  if (zone) query.zone = zone;
  if (lsa) query.lsa = lsa;
  if (status) query.status = status;

  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  return {
    query,
    options: {
      page: Number(page),
      limit: Number(limit),
      skip: (page - 1) * limit,
    }
  };
};
