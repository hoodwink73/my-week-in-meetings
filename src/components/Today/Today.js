import React from "react";
import moment from "moment";

export default function Today() {
  return moment().format("dddd, D MMM, h:mm A");
}
