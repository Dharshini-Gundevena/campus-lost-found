/**
 * Match controller
 *
 * Exposes potential matches for a single item report.
 * Validation and HTTP shaping live here; all matching logic is in matchService.
 */

const { getItemById } = require("../services/itemService");
const { findMatches }  = require("../services/matchService");

/**
 * GET /items/:id/matches
 *
 * Returns a ranked list of open, opposite-type items that are potential
 * matches for the specified item.
 *
 * Response shape:
 * {
 *   status:  "success",
 *   itemId:  "<id>",
 *   count:   <n>,
 *   data: [
 *     {
 *       item:    { ...full item document },
 *       score:   <number>,
 *       signals: ["location_overlap", "nearby_date"]  // subset
 *     },
 *     ...
 *   ]
 * }
 */
const getMatches = (req, res, next) => {
  try {
    const item = getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({
        status: "error",
        errors: [`Item with id "${req.params.id}" not found`],
      });
    }

    const matches = findMatches(item);

    return res.status(200).json({
      status:  "success",
      itemId:  item.id,
      count:   matches.length,
      data:    matches,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMatches };
