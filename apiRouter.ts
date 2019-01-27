import express = require("express");
const router = express.Router();
import actionMap from "../../apis";

router.post("/api", async (req, res) => {
  const params = req.body.params;
  const action = req.body.action;
  if ((actionMap as any)[action]) {
    try {
      const data = await Promise.resolve((actionMap as any)[action](...params));
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  } else {
    res.status(400).json({ error: "INVALID_ACTION" });
  }
});

export default router;
