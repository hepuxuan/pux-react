import express = require("express");
const router = express.Router();
import { actionMap } from "./proxy";

router.post("/api", (req, res) => {
  const params = req.body.params;
  const action = req.body.action;
  if (actionMap[action]) {
    Promise.resolve(actionMap[action](...params)).then(data => res.json(data));
  }
});

export default router;
