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
 * Get a single link group by groupUrl and render HTML page
 */
export const getLinkGroupPage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { groupUrl } = req.params;
    const linkGroup = await linkGroupModel.findOne({ groupUrl });

    if (!linkGroup) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Link Group Not Found</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: system-ui; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; margin: 0; padding: 20px; }
              .container { text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Link Group Not Found</h1>
              <p>The link group you're looking for doesn't exist.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Increment view counter
    linkGroup.views++;
    await linkGroup.save();

    // Render HTML page with links
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${linkGroup.groupName} | Scissor</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, ${linkGroup.theme.backgroundColor}22, ${linkGroup.theme.buttonColor}33);
              min-height: 100vh;
              padding: 2rem 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .header {
              text-align: center;
              margin-bottom: 2rem;
              color: #fff;
            }
            .logo {
              font-size: 0.875rem;
              opacity: 0.8;
              margin-bottom: 1.5rem;
            }
            .container {
              max-width: 42rem;
              width: 100%;
              background: rgba(255, 255, 255, 0.95);
              border-radius: 1.5rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              padding: 2rem;
            }
            h1 {
              color: ${linkGroup.theme.textColor};
              font-size: 2rem;
              margin-bottom: 0.5rem;
              text-align: center;
            }
            .description {
              color: #666;
              text-align: center;
              margin-bottom: 2rem;
              font-size: 0.875rem;
            }
            .stats {
              display: flex;
              justify-content: center;
              gap: 1.5rem;
              padding: 1rem 0;
              margin-bottom: 2rem;
              border-bottom: 1px solid #e5e7eb;
              color: #666;
              font-size: 0.875rem;
            }
            .links {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            }
            .link {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 1rem 1.5rem;
              background: ${linkGroup.theme.buttonColor};
              color: white;
              text-decoration: none;
              border-radius: 0.75rem;
              font-weight: 500;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .link:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .link svg {
              width: 1.25rem;
              height: 1.25rem;
              opacity: 0.7;
            }
            .empty {
              text-align: center;
              padding: 3rem;
              color: #999;
            }
            .footer {
              margin-top: 2rem;
              text-align: center;
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.875rem;
            }
            .footer a {
              color: rgba(255, 255, 255, 0.9);
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">⚡ Powered by Scissor</div>
          </div>
          
          <div class="container">
            <h1>${linkGroup.groupName}</h1>
            ${linkGroup.description ? `<p class="description">${linkGroup.description}</p>` : ''}
            
            <div class="stats">
              <span>🔗 ${linkGroup.links.length} links</span>
              <span>•</span>
              <span>👀 ${linkGroup.views} views</span>
            </div>
            
            <div class="links">
              ${linkGroup.links.length > 0 ? linkGroup.links
                .sort((a, b) => a.order - b.order)
                .map(link => `
                  <a href="${link.url}" class="link" target="_blank" rel="noopener noreferrer">
                    <span>${link.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                `).join('') : '<div class="empty">No links added yet</div>'}
            </div>
          </div>
          
          <div class="footer">
            Created with <a href="/">Scissor</a>
          </div>
        </body>
      </html>
    `;

    return res.send(html);
  } catch (error) {
    console.error("Error in getLinkGroupPage:", error);
    return res.status(500).send("Something went wrong");
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
