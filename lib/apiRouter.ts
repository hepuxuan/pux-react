import express = require("express");
import * as _ from "lodash";
const router = express.Router();

import appRoutes = require("./routes");

const actionMap: any = {};

appRoutes.map(route => {
  Object.getOwnPropertyNames(route.component).forEach(key => {
    if (_.isFunction((route.component as any)[key])) {
      actionMap[route.component.name + key] = (route.component as any)[key];
    }
  });
});

console.log(actionMap);

router.post("/api", (req, res) => {
  const params = req.body.params;
  const action = req.body.action;

  console.log({
    params,
    action
  });

  if (actionMap[action]) {
    Promise.resolve(actionMap[action](...params)).then(data => res.json(data));
  }
});

export default router;
