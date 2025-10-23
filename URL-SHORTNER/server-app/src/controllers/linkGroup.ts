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

    // Increment view count
    linkGroup.views += 1;
    await linkGroup.save();

    // Get theme with defaults
    const theme = linkGroup.theme || {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#3b82f6",
    };

    // Generate HTML page
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${linkGroup.groupName} | Scissor</title>
        <link rel="icon" type="image/png" href="https://i.imgur.com/YourScissorFavicon.png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .header {
            max-width: 680px;
            margin: 0 auto 1.5rem;
            width: 100%;
            text-align: center;
            animation: slideIn 0.6s ease;
          }

          .logo {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 2rem;
            font-weight: 600;
            color: #fff;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .logo:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }

          .logo-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .container {
            flex: 1;
            max-width: 680px;
            margin: 0 auto;
            width: 100%;
            animation: slideIn 0.7s ease;
          }

          .profile-section {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .avatar {
            width: 96px;
            height: 96px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: #fff;
            border: 4px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            animation: scaleIn 0.8s ease;
            overflow: hidden;
          }

          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          h1 {
            color: #fff;
            font-size: 2rem;
            margin-bottom: 0.75rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }

          .description {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 1.5rem;
            font-size: 1rem;
            line-height: 1.6;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.9rem;
            font-weight: 500;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
          }

          .stat-icon {
            font-size: 1.1rem;
          }

          .links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
          }

          .link {
            display: block;
            background: rgba(255, 255, 255, 0.95);
            color: #2d3748;
            padding: 1.25rem 1.5rem;
            border-radius: 1rem;
            text-decoration: none;
            text-align: center;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
            animation: slideIn 0.5s ease backwards;
          }

          .link:nth-child(1) { animation-delay: 0.1s; }
          .link:nth-child(2) { animation-delay: 0.15s; }
          .link:nth-child(3) { animation-delay: 0.2s; }
          .link:nth-child(4) { animation-delay: 0.25s; }
          .link:nth-child(5) { animation-delay: 0.3s; }
          .link:nth-child(n+6) { animation-delay: 0.35s; }

          .link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.5s ease;
          }

          .link:hover::before {
            left: 100%;
          }

          .link:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
            border-color: rgba(102, 126, 234, 0.3);
            background: #fff;
          }

          .link:active {
            transform: translateY(-1px);
          }

          .link span {
            position: relative;
            z-index: 1;
          }

          .footer {
            text-align: center;
            margin-top: 3rem;
            padding: 1.5rem;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.85rem;
          }

          .footer a {
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            transition: opacity 0.2s;
          }

          .footer a:hover {
            opacity: 0.8;
          }

          @media (max-width: 640px) {
            body {
              padding: 0.5rem;
            }

            .avatar {
              width: 80px;
              height: 80px;
              font-size: 2rem;
              margin-bottom: 1rem;
            }

            h1 {
              font-size: 1.5rem;
            }

            .description {
              font-size: 0.9rem;
            }

            .stats {
              gap: 1rem;
              font-size: 0.85rem;
            }

            .stat-item {
              padding: 0.4rem 0.8rem;
            }

            .link {
              padding: 1rem 1.25rem;
              font-size: 0.95rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <a href="/" class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L12 12M12 12L4 20M12 12L20 20M12 12L4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Scissor</span>
          </a>
        </div>
        <div class="container">
          <div class="profile-section">
            <div class="avatar">
              ${
                linkGroup.profileImage
                  ? `<img src="${linkGroup.profileImage}" alt="${linkGroup.groupName}" />`
                  : linkGroup.groupName.charAt(0).toUpperCase()
              }
            </div>
            <h1>${linkGroup.groupName}</h1>
            ${
              linkGroup.description
                ? `<div class="description">${linkGroup.description}</div>`
                : ""
            }
            <div class="stats">
              <div class="stat-item">
                <span class="stat-icon">🔗</span>
                <span>${linkGroup.links.length} ${
      linkGroup.links.length === 1 ? "link" : "links"
    }</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">👁️</span>
                <span>${linkGroup.views} ${
      linkGroup.views === 1 ? "view" : "views"
    }</span>
              </div>
            </div>
          </div>
          <div class="links">
            ${linkGroup.links
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(
                (link) => `
                <a href="${link.url}" class="link" target="_blank" rel="noopener noreferrer">
                  <span>${link.title}</span>
                </a>
              `
              )
              .join("")}
          </div>
          <div class="footer">
            Create your own link page with <a href="/">Scissor</a>
          </div>
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
