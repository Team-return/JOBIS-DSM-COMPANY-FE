"use client";

import { useState } from "react";
import EditRecruiment from "./editRecruitment";
import ViewRecruitment from "./viewRecruitment";

export default function Home() {
  const [canEdit, setCanEdit] = useState(false);

  return canEdit ? <EditRecruiment setCanEdit={setCanEdit} /> : <ViewRecruitment setCanEdit={setCanEdit} />;
}
