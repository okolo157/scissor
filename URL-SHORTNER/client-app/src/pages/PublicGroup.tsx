import * as React from "react";
import axios from "axios";
import { useParams, Link as RouterLink } from "react-router-dom";
import { serverUrl } from "../helpers/constants";
import { LinkGroup } from "../interface/linkGroup";
import { motion } from "framer-motion";
import { ExternalLink, Eye, Home, Loader2 } from "lucide-react";
import Logo from "../assets/scissor-logo.png";

const PublicGroup: React.FC = () => {
  const { groupUrl } = useParams<{ groupUrl: string }>();
  const [linkGroup, setLinkGroup] = React.useState<LinkGroup | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!groupUrl) return;

    const fetchLinkGroup = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<LinkGroup>(
          `${serverUrl}/api/linkGroup/${groupUrl}`
        );
        setLinkGroup(response.data);
      } catch (err: any) {
        console.error("Error fetching link group:", err);
        setError("Link group not found");
      } finally {
        setLoading(false);
      }
    };

    fetchLinkGroup();
  }, [groupUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="text-blue-400 animate-spin mx-auto mb-4"
          />
          <p className="text-blue-200">Loading link group...</p>
        </div>
      </div>
    );
  }

  if (error || !linkGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink
              size={40}
              className="text-red-600 dark:text-red-400"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Link Group Not Found
          </h2>
          <p className="text-blue-200 mb-6">
            The link group you're looking for doesn't exist or has been removed.
          </p>
          <RouterLink
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            Go to Homepage
          </RouterLink>
        </motion.div>
      </div>
    );
  }

  const { theme } = linkGroup;

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: `linear-gradient(135deg, ${theme.backgroundColor}22, ${theme.buttonColor}33)`,
      }}
    >
      <div className="container mx-auto max-w-2xl">
        {/* Header with Scissor branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <RouterLink
            to="/"
            className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-6"
          >
            <img src={Logo} alt="Scissor" className="w-8 h-8" />
            <span className="text-sm font-medium">Powered by Scissor</span>
          </RouterLink>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6"
        >
          <div className="text-center mb-6">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.textColor }}
            >
              {linkGroup.groupName}
            </h1>
            {linkGroup.description && (
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                {linkGroup.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <ExternalLink size={16} />
              <span className="text-sm font-medium">
                {linkGroup.links.length} links
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center gap-2 text-gray-600">
              <Eye size={16} />
              <span className="text-sm font-medium">
                {linkGroup.views} views
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {linkGroup.links
              .sort((a, b) => a.order - b.order)
              .map((link, index) => (
                <motion.a
                  key={link._id || index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="block w-full p-4 rounded-xl font-medium text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg group"
                  style={{
                    backgroundColor: theme.buttonColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{link.title}</span>
                    <ExternalLink
                      size={20}
                      className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </motion.a>
              ))}
          </div>

          {linkGroup.links.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ExternalLink size={48} className="mx-auto mb-4 opacity-30" />
              <p>No links added yet</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-white/70">
            Created with{" "}
            <RouterLink
              to="/"
              className="text-blue-300 hover:text-blue-200 font-medium"
            >
              Scissor
            </RouterLink>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicGroup;
