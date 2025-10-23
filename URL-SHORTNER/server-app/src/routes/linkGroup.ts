import express from "express";
import {
  createLinkGroup,
  getAllLinkGroups,
  getLinkGroup,
  updateLinkGroup,
  deleteLinkGroup,
  addLinkToGroup,
  removeLinkFromGroup,
} from "../controllers/linkGroup";

const router = express.Router();

router.post("/linkGroup", createLinkGroup);
router.get("/linkGroups", getAllLinkGroups);
router.get("/linkGroup/:groupUrl", getLinkGroup);
router.put("/linkGroup/:id", updateLinkGroup);
router.delete("/linkGroup/:id", deleteLinkGroup);
router.post("/linkGroup/:id/link", addLinkToGroup);
router.delete("/linkGroup/:id/link/:linkId", removeLinkFromGroup);

export default router;
