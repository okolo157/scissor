import express from "express";
import { linkGroupModel } from "../models/linkGroup";

/**
 * Create a new link group
 */
export const createLinkGroup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { groupName, description, links, theme } = req.body;

    if (!groupName) {
      return res.status(400).send({ message: "Group name is required" });
    }

    const linkGroup = await linkGroupModel.create({
      groupName,
      description,
      links: links || [],
      theme: theme || {},
    });

    console.log("New link group created:", linkGroup.groupUrl);
    return res.status(201).send(linkGroup);
  } catch (error) {
    console.error("Error in createLinkGroup:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Get all link groups
 */
export const getAllLinkGroups = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const linkGroups = await linkGroupModel.find().sort({ createdAt: -1 });
    return res.status(200).send(linkGroups);
  } catch (error) {
    console.error("Error in getAllLinkGroups:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Get a single link group by groupUrl
 */
export const getLinkGroup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { groupUrl } = req.params;
    const linkGroup = await linkGroupModel.findOne({ groupUrl });

    if (!linkGroup) {
      return res.status(404).send({ message: "Link group not found" });
    }

    // Increment view counter
    linkGroup.views++;
    await linkGroup.save();

    return res.status(200).send(linkGroup);
  } catch (error) {
    console.error("Error in getLinkGroup:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Update a link group
 */
export const updateLinkGroup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { groupName, description, links, theme } = req.body;

    const linkGroup = await linkGroupModel.findByIdAndUpdate(
      id,
      { groupName, description, links, theme },
      { new: true, runValidators: true }
    );

    if (!linkGroup) {
      return res.status(404).send({ message: "Link group not found" });
    }

    console.log("Link group updated:", linkGroup.groupUrl);
    return res.status(200).send(linkGroup);
  } catch (error) {
    console.error("Error in updateLinkGroup:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Delete a link group
 */
export const deleteLinkGroup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const linkGroup = await linkGroupModel.findByIdAndDelete(id);

    if (!linkGroup) {
      return res.status(404).send({ message: "Link group not found" });
    }

    console.log("Link group deleted:", linkGroup.groupUrl);
    return res.status(204).send();
  } catch (error) {
    console.error("Error in deleteLinkGroup:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Add a link to a group
 */
export const addLinkToGroup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).send({ message: "Title and URL are required" });
    }

    const linkGroup = await linkGroupModel.findById(id);
    if (!linkGroup) {
      return res.status(404).send({ message: "Link group not found" });
    }

    linkGroup.links.push({
      title,
      url,
      order: linkGroup.links.length,
    });

    await linkGroup.save();
    return res.status(200).send(linkGroup);
  } catch (error) {
    console.error("Error in addLinkToGroup:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Remove a link from a group
 */
export const removeLinkFromGroup = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id, linkId } = req.params;

    const linkGroup = await linkGroupModel.findById(id);
    if (!linkGroup) {
      return res.status(404).send({ message: "Link group not found" });
    }

    const linkIndex = linkGroup.links.findIndex(
      (link: any) => link._id?.toString() === linkId
    );

    if (linkIndex !== -1) {
      linkGroup.links.splice(linkIndex, 1);
    }

    await linkGroup.save();
    return res.status(200).send(linkGroup);
  } catch (error) {
    console.error("Error in removeLinkFromGroup:", error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
