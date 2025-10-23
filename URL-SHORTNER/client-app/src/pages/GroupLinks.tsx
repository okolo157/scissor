import React, { useState, useCallback } from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { Link } from "../interface/linkGroup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Link2,
  Save,
  X,
  Image,
  Upload,
  Trash2,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { CircularProgress } from "@mui/material";

const GroupLinks: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createdGroupUrl, setCreatedGroupUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    profileImage: "",
    links: [] as Link[],
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleCreateGroup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (formData.links.length === 0) {
        alert("Please add at least one link to the group");
        return;
      }

      try {
        console.log("Creating group with data:", formData);

        const response = await axios.post(
          `${serverUrl}/api/linkGroup`,
          formData
        );
        setCreatedGroupUrl(response.data.groupUrl);
        setShowCreateModal(false);
        resetForm();
      } catch (error) {
        console.error("Error creating link group:", error);
        alert("Failed to create link group. Please try again.");
      }
    },
    [formData]
  );

  const addLinkToForm = useCallback(() => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      alert("Please fill in both title and URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newLink.url);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { ...newLink, order: prev.links.length }],
    }));
    setNewLink({ title: "", url: "" });
  }, [newLink]);

  const removeLinkFromForm = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links
        .filter((_, i) => i !== index)
        .map((link, i) => ({ ...link, order: i })),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      groupName: "",
      description: "",
      profileImage: "",
      links: [],
    });
    setNewLink({ title: "", url: "" });
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    resetForm();
  }, [resetForm]);

  const copyCreatedUrl = useCallback(() => {
    if (!createdGroupUrl) return;
    const fullUrl = `${window.location.origin}/g/${createdGroupUrl}`;
    navigator.clipboard.writeText(fullUrl);
  }, [createdGroupUrl]);

  return (
    <div className="relative flex flex-col items-center w-full justify-center py-8 min-h-screen px-4 text-white overflow-hidden">
      {/* Background blobs for visual depth */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-8"
      >
        <div className="text-center mb-6 border-b border-white/10 pb-6">
          <h1 className="text-white text-3xl font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] mb-2">
            Link <span className="text-blue-400">Groups</span>
          </h1>
          <p className="text-blue-200 text-sm">
            Create a beautiful landing page with all your links in one place
          </p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {createdGroupUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 border border-green-400/30 bg-green-500/10 backdrop-blur-md rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={20} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    🎉 Link Group Created!
                  </h3>
                  <p className="text-green-200 text-sm mb-3">
                    Your link group is ready to share
                  </p>
                  <div className="bg-black/20 rounded-lg p-3 mb-3">
                    <p className="text-xs text-green-300 mb-1">Your Link:</p>
                    <code className="text-sm text-white break-all">
                      {window.location.origin}/g/{createdGroupUrl}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyCreatedUrl}
                      className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Copy size={16} />
                      Copy Link
                    </button>
                    <a
                      href={`/g/${createdGroupUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink size={16} />
                      View Page
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setCreatedGroupUrl(null)}
                  className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Link2 size={24} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  What are Link Groups?
                </h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Create a personalized landing page (like Linktree) with all
                  your important links - social media, portfolio, store, blog,
                  and more.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="text-white font-medium text-sm mb-1">
                Fast Setup
              </h4>
              <p className="text-blue-200 text-xs">Create in seconds</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="text-white font-medium text-sm mb-1">
                Beautiful Design
              </h4>
              <p className="text-blue-200 text-xs">Professional look</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="text-white font-medium text-sm mb-1">One Link</h4>
              <p className="text-blue-200 text-xs">Share everywhere</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 font-semibold"
          >
            <Plus size={24} />
            Create Link Group
          </button>
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-10 mt-8 max-w-2xl text-center px-4"
      >
        <p className="text-blue-200 text-sm leading-relaxed">
          Perfect for content creators, influencers, businesses, and anyone who
          wants to share multiple links through a single, memorable URL. No
          login required!
        </p>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <GroupModal
            formData={formData}
            setFormData={setFormData}
            newLink={newLink}
            setNewLink={setNewLink}
            onSubmit={handleCreateGroup}
            onClose={closeModal}
            addLinkToForm={addLinkToForm}
            removeLinkFromForm={removeLinkFromForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Group Modal Component
interface GroupModalProps {
  formData: {
    groupName: string;
    description: string;
    profileImage: string;
    links: Link[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      groupName: string;
      description: string;
      profileImage: string;
      links: Link[];
    }>
  >;
  newLink: { title: string; url: string };
  setNewLink: React.Dispatch<
    React.SetStateAction<{ title: string; url: string }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  addLinkToForm: () => void;
  removeLinkFromForm: (index: number) => void;
}

const GroupModal: React.FC<GroupModalProps> = ({
  formData,
  setFormData,
  newLink,
  setNewLink,
  onSubmit,
  onClose,
  addLinkToForm,
  removeLinkFromForm,
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "scissor_uploads");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmctp7kty/image/upload",
        formDataUpload
      );

      console.log("Image uploaded to Cloudinary:", response.data.secure_url);

      setFormData((prev) => {
        const updated = {
          ...prev,
          profileImage: response.data.secure_url,
        };
        console.log("Updated formData with image:", updated);
        return updated;
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">Create New Link Group</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.groupName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, groupName: e.target.value }))
              }
              placeholder="My Social Links"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="A brief description of your link group"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Image size={16} />
                Profile Image
              </div>
            </label>

            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={uploadingImage}
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    {uploadingImage ? (
                      <>
                        <CircularProgress size={20} />
                        <span>Uploading...</span>
                      </>
                    ) : formData.profileImage ? (
                      <>
                        <Check size={20} className="text-green-600" />
                        <span className="text-green-600 dark:text-green-400">
                          Image uploaded
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Click to upload image</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {formData.profileImage && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={formData.profileImage}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, profileImage: "" }))
                  }
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Links {formData.links.length > 0 && `(${formData.links.length})`}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Link title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, title: e.target.value }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLinkToForm();
                    }
                  }}
                />
                <input
                  type="url"
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink((prev) => ({ ...prev, url: e.target.value }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLinkToForm();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addLinkToForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Add link"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {formData.links.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Link2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No links added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group"
                  >
                    <Link2 size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">
                        {link.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {link.url}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLinkFromForm(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                      title="Remove link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.links.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              Create Group
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupLinks;
