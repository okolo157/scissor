import express from "express";
import {
  createLinkGroup,
  getAllLinkGroups,
  getLinkGroupPage,
  updateLinkGroup,
  deleteLinkGroup,
  addLinkToGroup,
  removeLinkFromGroup,
} from "../controllers/linkGroup";

const router = express.Router();

router.post("/linkGroup", createLinkGroup);
router.get("/linkGroups", getAllLinkGroups);
router.put("/linkGroup/:id", updateLinkGroup);
router.delete("/linkGroup/:id", deleteLinkGroup);
router.post("/linkGroup/:id/link", addLinkToGroup);
router.delete("/linkGroup/:id/link/:linkId", removeLinkFromGroup);

// Export the page handler separately for use in server.ts
export { getLinkGroupPage };

export default router;
