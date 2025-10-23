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
    const { groupName, description, profileImage, links, theme, customUrl } =
      req.body;

    if (!groupName) {
      return res.status(400).send({ message: "Group name is required" });
    }

    if (customUrl) {
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customUrl)) {
        return res.status(400).send({
          message:
            "Custom URL must be 3-30 characters and contain only letters, numbers, hyphens, and underscores",
        });
      }

      const existingCustomUrl = await linkGroupModel.findOne({
        groupUrl: customUrl,
      });
      if (existingCustomUrl) {
        return res.status(409).send({
          message: "This custom URL is already taken. Please choose another.",
        });
      }
    }

    const linkGroupData: any = {
      groupName,
      description,
      profileImage,
      links: links || [],
      theme: theme || {},
    };

    if (customUrl) {
      linkGroupData.groupUrl = customUrl;
    }

    const linkGroup = await linkGroupModel.create(linkGroupData);

    console.log("New link group created:", linkGroup.groupUrl);
    return res.status(201).send(linkGroup);
  } catch (error) {
    console.error("Error in createLinkGroup:", error);
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
    const { groupName, description, profileImage, links, theme } = req.body;

    const linkGroup = await linkGroupModel.findByIdAndUpdate(
      id,
      { groupName, description, profileImage, links, theme },
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

    linkGroup.views += 1;
    await linkGroup.save();

    const theme = linkGroup.theme || {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#3b82f6",
    };

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${linkGroup.groupName} | Scissor</title>
        <meta name="description" content="${
          linkGroup.description ||
          `Check out all links from ${linkGroup.groupName}. Powered by Scissor.`
        }" />
        
        <link rel="canonical" href="https://www.scissor.site/g/${
          linkGroup.groupUrl
        }" />
        
        <meta property="og:title" content="${linkGroup.groupName}" />
        <meta property="og:description" content="${
          linkGroup.description || `All my links in one place`
        }" />
        ${
          linkGroup.profileImage
            ? `<meta property="og:image" content="${linkGroup.profileImage}" />`
            : '<meta property="og:image" content="https://www.scissor.site/og-image.png" />'
        }
        <meta property="og:url" content="https://www.scissor.site/g/${
          linkGroup.groupUrl
        }" />
        <meta property="og:type" content="profile" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${linkGroup.groupName}" />
        <meta name="twitter:description" content="${
          linkGroup.description || `All my links in one place`
        }" />
        ${
          linkGroup.profileImage
            ? `<meta name="twitter:image" content="${linkGroup.profileImage}" />`
            : '<meta name="twitter:image" content="https://www.scissor.site/og-image.png" />'
        }
        
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="link in bio, ${
          linkGroup.groupName
        }, social links, linktree" />
        
        <link rel="icon" type="image/png" href="https://www.scissor.site/favicon.png" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": "${linkGroup.groupName}",
          "description": "${linkGroup.description || ""}",
          ${
            linkGroup.profileImage
              ? `"image": "${linkGroup.profileImage}",`
              : ""
          }
          "url": "https://www.scissor.site/g/${linkGroup.groupUrl}",
          "mainEntity": {
            "@type": "Person",
            "name": "${linkGroup.groupName}",
            ${
              linkGroup.profileImage
                ? `"image": "${linkGroup.profileImage}",`
                : ""
            }
            "sameAs": [
              ${linkGroup.links
                .map((link) => `"${link.url}"`)
                .join(",\n              ")}
            ]
          }
        }
        </script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          :root {
            --primary: #6366f1;
            --primary-light: #818cf8;
            --primary-dark: #4f46e5;
            --bg-gradient-1: #667eea;
            --bg-gradient-2: #764ba2;
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
            position: relative;
            overflow-x: hidden;
          }

          body::before {
            content: '';
            position: fixed;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: rotate 30s linear infinite;
            pointer-events: none;
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          .container {
            position: relative;
            z-index: 1;
            flex: 1;
            max-width: 720px;
            margin: 0 auto;
            width: 100%;
            animation: fadeIn 0.6s ease;
          }

          .profile-section {
            text-align: center;
            margin-bottom: 2.5rem;
            animation: slideUp 0.7s ease;
          }

          .avatar-container {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 1.5rem;
            animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .avatar {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            font-weight: 800;
            color: #fff;
            border: 5px solid rgba(255, 255, 255, 0.3);
            box-shadow: 
              0 10px 40px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 2px 20px rgba(255, 255, 255, 0.2) inset;
            overflow: hidden;
            position: relative;
            transition: transform 0.3s ease;
          }

          .avatar:hover {
            transform: scale(1.05);
          }

          .avatar::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.3) 50%,
              transparent 70%
            );
            animation: shimmer 3s infinite;
          }

          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: relative;
            z-index: 1;
          }



          h1 {
            color: #fff;
            font-size: 2.5rem;
            margin-bottom: 0.75rem;
            font-weight: 800;
            letter-spacing: -1px;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            line-height: 1.2;
          }

          .description {
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            line-height: 1.6;
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
            font-weight: 500;
          }

          .links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
          }

          .link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.98);
            color: #1f2937;
            padding: 1.25rem 1.75rem;
            border-radius: 1.25rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.05rem;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 
              0 4px 20px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
            animation: slideUp 0.5s ease backwards;
            backdrop-filter: blur(10px);
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
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.15), transparent);
            transition: left 0.6s ease;
          }

          .link:hover::before {
            left: 100%;
          }

          .link:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 
              0 12px 40px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(102, 126, 234, 0.2) inset;
            border-color: rgba(102, 126, 234, 0.4);
            background: #ffffff;
          }

          .link:active {
            transform: translateY(-2px) scale(1.01);
          }

          .link-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            position: relative;
            z-index: 1;
          }

          .link-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            transition: transform 0.3s ease;
          }

          .link:hover .link-icon {
            transform: rotate(5deg) scale(1.1);
          }

          .link-text {
            text-align: left;
          }

          .link-arrow {
            color: #9ca3af;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
          }

          .link:hover .link-arrow {
            color: #667eea;
            transform: translateX(5px);
          }

          .footer {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem 1.5rem;
            position: relative;
            z-index: 1;
          }

          .footer-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border-radius: 1.5rem;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          }

          .footer-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
          }

          .footer-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: white;
            color: #667eea;
            text-decoration: none;
            font-weight: 700;
            border-radius: 2rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            font-size: 0.95rem;
          }

          .footer-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
            background: #f9fafb;
          }

          .footer-cta svg {
            width: 18px;
            height: 18px;
          }

          @media (max-width: 640px) {
            body {
              padding: 1rem;
            }

            .avatar-container {
              width: 100px;
              height: 100px;
            }

            .avatar {
              font-size: 2.5rem;
              border-width: 4px;
            }

            .status-badge {
              width: 20px;
              height: 20px;
              border-width: 3px;
              bottom: 5px;
              right: 5px;
            }

            h1 {
              font-size: 2rem;
            }

            .description {
              font-size: 1rem;
            }

            .link {
              padding: 1.1rem 1.25rem;
              font-size: 0.95rem;
            }

            .link-icon {
              width: 36px;
              height: 36px;
              font-size: 1.1rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="profile-section">
            <div class="avatar-container">
              <div class="avatar">
                ${
                  linkGroup.profileImage
                    ? `<img src="${linkGroup.profileImage}" alt="${linkGroup.groupName}" />`
                    : linkGroup.groupName.charAt(0).toUpperCase()
                }
              </div>
              <div class="status-badge"></div>
            </div>
            <h1>${linkGroup.groupName}</h1>
            ${
              linkGroup.description
                ? `<div class="description">${linkGroup.description}</div>`
                : ""
            }
          </div>
          
          <div class="links">
            ${linkGroup.links
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(
                (link, index) => `
                <a href="${
                  link.url
                }" class="link" target="_blank" rel="noopener noreferrer">
                  <div class="link-content">
                    <div class="link-icon">
                      ${getIconForLink(link.url, link.title)}
                    </div>
                    <div class="link-text">
                      ${link.title}
                    </div>
                  </div>
                  <div class="link-arrow">→</div>
                </a>
              `
              )
              .join("")}
          </div>
          
          <div class="footer">
            Create your own link page with <a href="https://scissor.site">Scissor</a>
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

// Helper function to get appropriate icon for links
function getIconForLink(url: string, title: string): string {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (
    lowerUrl.includes("twitter.com") ||
    lowerUrl.includes("x.com") ||
    lowerTitle.includes("twitter")
  ) {
    return "𝕏";
  }
  if (lowerUrl.includes("instagram.com") || lowerTitle.includes("instagram")) {
    return "📷";
  }
  if (lowerUrl.includes("linkedin.com") || lowerTitle.includes("linkedin")) {
    return "💼";
  }
  if (lowerUrl.includes("youtube.com") || lowerTitle.includes("youtube")) {
    return "▶️";
  }
  if (lowerUrl.includes("github.com") || lowerTitle.includes("github")) {
    return "⚡";
  }
  if (lowerUrl.includes("facebook.com") || lowerTitle.includes("facebook")) {
    return "👥";
  }
  if (lowerUrl.includes("tiktok.com") || lowerTitle.includes("tiktok")) {
    return "🎵";
  }
  if (lowerTitle.includes("email") || lowerTitle.includes("contact")) {
    return "✉️";
  }
  if (lowerTitle.includes("shop") || lowerTitle.includes("store")) {
    return "🛍️";
  }
  if (lowerTitle.includes("website") || lowerTitle.includes("portfolio")) {
    return "🌐";
  }
  return "🔗";
}

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
