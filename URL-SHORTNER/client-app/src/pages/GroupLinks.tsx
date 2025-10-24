import React, { useState, useCallback } from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { Link } from "../interface/linkGroup";
import SEO from "../components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  FolderKanban,
} from "lucide-react";
import { CircularProgress } from "@mui/material";

const GroupLinks: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createdGroupUrl, setCreatedGroupUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    profileImage: "",
    customUrl: "",
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

      setIsSubmitting(true);

      try {
        console.log("Creating group with data:", formData);

        const response = await axios.post(`${serverUrl}/api/linkGroup`, {
          groupName: formData.groupName,
          description: formData.description,
          profileImage: formData.profileImage,
          links: formData.links,
          customUrl: formData.customUrl.trim() || undefined,
        });
        setCreatedGroupUrl(response.data.groupUrl);
        setShowCreateModal(false);
        resetForm();
      } catch (error: unknown) {
        console.error("Error creating link group:", error);
        let errorMessage = "Failed to create link group. Please try again.";
        if (error && typeof error === "object" && "response" in error) {
          const response = (
            error as { response?: { data?: { message?: string } } }
          ).response;
          errorMessage = response?.data?.message || errorMessage;
        }
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
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
      customUrl: "",
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
    <>
      <SEO
        title="Link Groups — Create Your Link in Bio Page | Scissor"
        description="Create a beautiful link-in-bio page with Scissor. Perfect alternative to Linktree. Group all your important links in one place - social media, portfolio, store, and more."
        keywords="link in bio, linktree alternative, link groups, bio link, social media links, link page, free linktree"
        canonical="https://www.scissor.site/links"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Scissor Link Groups",
          url: "https://www.scissor.site/group-links",
          description:
            "Create beautiful link-in-bio pages to share all your important links in one place.",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <div className="relative flex flex-col items-center w-full justify-center py-8 min-h-screen px-4 text-white overflow-hidden">
        {/* Background blobs for visual depth */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/")}
          className="relative z-10 self-start mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-lg transition-all text-blue-200 hover:text-white"
          aria-label="Go back to home page"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-4 sm:p-6 md:p-8"
        >
          <div className="text-center mb-4 sm:mb-6 flex items-center justify-center flex-col gap-3 border-b border-white/10 pb-4 sm:pb-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-shadow"
              aria-hidden="true"
            >
              <FolderKanban size={40} className="text-white" />
            </div>
            <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] mb-2">
              Link <span className="text-blue-400">Groups</span>
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
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
                <h4 className="text-white font-medium text-sm mb-1">
                  One Link
                </h4>
                <p className="text-blue-200 text-xs">Share everywhere</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-blue-500/30 font-semibold text-sm sm:text-base"
            >
              <Plus size={20} className="sm:w-6 sm:h-6" />
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
            Perfect for content creators, influencers, businesses, and anyone
            who wants to share multiple links through a single, memorable URL.
            No login required!
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
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Group Modal Component
interface GroupModalProps {
  formData: {
    groupName: string;
    description: string;
    profileImage: string;
    customUrl: string;
    links: Link[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      groupName: string;
      description: string;
      profileImage: string;
      customUrl: string;
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
  isSubmitting: boolean;
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
  isSubmitting,
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
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="min-h-screen w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Link2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Create New Link Group
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Build your personalized link-in-bio page
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
          >
            <X size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8"
        >
          {/* Group Name & Custom URL - Side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Group Name *
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-lg"
                value={formData.groupName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    groupName: e.target.value,
                  }))
                }
                placeholder="My Social Links"
                disabled={isSubmitting}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Custom URL (Optional)
              </label>
              <div className="flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-4 focus-within:ring-blue-500 dark:bg-gray-700">
                <span className="pl-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {window.location.origin}/g/
                </span>
                <input
                  type="text"
                  autoComplete="off"
                  className="flex-1 px-2 py-3 sm:py-4 bg-transparent dark:text-white outline-none text-base sm:text-lg"
                  value={formData.customUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customUrl: e.target.value,
                    }))
                  }
                  placeholder="custom-name"
                  pattern="[a-zA-Z0-9_-]{3,30}"
                  title="3-30 characters: letters, numbers, hyphens, and underscores only"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Leave empty for auto-generated URL
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description
            </label>
            <textarea
              autoComplete="off"
              className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base sm:text-lg resize-none"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="A brief description of your link group"
              disabled={isSubmitting}
            />
          </div>

          {/* Profile Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <div className="flex items-center gap-2">
                <Image size={20} />
                Profile Image
              </div>
            </label>

            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploadingImage || isSubmitting}
                />
                <div className="w-full px-4 py-4 sm:py-5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
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
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
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
                  disabled={isSubmitting}
                />
                <input
                  type="url"
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
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
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addLinkToForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
                  title="Add link"
                >
                  <Plus size={20} className="mx-auto" />
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                formData.links.length === 0 || isSubmitting || uploadingImage
              }
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupLinks;
