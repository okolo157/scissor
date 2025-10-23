import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { LinkGroup, Link } from "../interface/linkGroup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Link2,
  Save,
  X,
  Image,
  Upload,
  Trash2,
} from "lucide-react";
import { CircularProgress } from "@mui/material";

const GroupLinks: React.FC = () => {
  const [linkGroups, setLinkGroups] = useState<LinkGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<LinkGroup | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    profileImage: "",
    links: [] as Link[],
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });

  useEffect(() => {
    fetchLinkGroups();
  }, []);

  const fetchLinkGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get<LinkGroup[]>(
        `${serverUrl}/api/linkGroups`
      );
      setLinkGroups(response.data);
    } catch (error) {
      console.error("Error fetching link groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await axios.post<LinkGroup>(
          `${serverUrl}/api/linkGroup`,
          formData
        );
        setLinkGroups((prev) => [response.data, ...prev]);
        setShowCreateModal(false);
        setFormData({
          groupName: "",
          description: "",
          profileImage: "",
          links: [],
        });
        setNewLink({ title: "", url: "" });
      } catch (error) {
        console.error("Error creating link group:", error);
      }
    },
    [formData]
  );

  const handleUpdateGroup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingGroup) return;

      try {
        const response = await axios.put<LinkGroup>(
          `${serverUrl}/api/linkGroup/${editingGroup._id}`,
          formData
        );
        setLinkGroups((prev) =>
          prev.map((group) =>
            group._id === editingGroup._id ? response.data : group
          )
        );
        setEditingGroup(null);
        setFormData({
          groupName: "",
          description: "",
          profileImage: "",
          links: [],
        });
        setNewLink({ title: "", url: "" });
      } catch (error) {
        console.error("Error updating link group:", error);
      }
    },
    [editingGroup, formData]
  );

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
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

      setFormData((prev) => ({
        ...prev,
        profileImage: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const addLinkToForm = useCallback(() => {
    if (!newLink.title || !newLink.url) return;

    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { ...newLink, order: prev.links.length }],
    }));
    setNewLink({ title: "", url: "" });
  }, [newLink]);

  const removeLinkFromForm = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  }, []);

  const openEditModal = (group: LinkGroup) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      description: group.description,
      profileImage: group.profileImage || "",
      links: group.links,
    });
  };

  const copyGroupUrl = (groupUrl: string) => {
    const fullUrl = `${window.location.origin}/g/${groupUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(groupUrl);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingGroup(null);
    setFormData({
      groupName: "",
      description: "",
      profileImage: "",
      links: [],
    });
    setNewLink({ title: "", url: "" });
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Link Groups</h1>
            <p className="text-blue-200">
              Create and manage your grouped links - similar to Linktree
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : linkGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
          >
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No link groups yet
            </h3>
            <p className="text-blue-200 mb-6">
              Create your first link group to organize and share your links
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Group
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {linkGroups.map((group) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  {group.profileImage ? (
                    <img
                      src={group.profileImage}
                      alt={group.groupName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                      {group.groupName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 ml-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {group.groupName}
                    </h3>
                    <p className="text-sm text-blue-200 line-clamp-2">
                      {group.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-blue-200 mb-4">
                  <span className="flex items-center gap-1">
                    <Link2 size={14} />
                    {group.links.length} links
                  </span>
                  {/* <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {group.views} views
                  </span> */}
                </div>

                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-200 mb-1">Group URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-white flex-1 truncate">
                      /g/{group.groupUrl}
                    </code>
                    <button
                      onClick={() => copyGroupUrl(group.groupUrl)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedUrl === group.groupUrl ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} className="text-blue-300" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/g/${group.groupUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink size={16} />
                    View
                  </a>
                  <button
                    onClick={() => openEditModal(group)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {(showCreateModal || editingGroup) && (
          <GroupModal
            isEdit={!!editingGroup}
            formData={formData}
            setFormData={setFormData}
            newLink={newLink}
            setNewLink={setNewLink}
            onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
            onClose={closeModal}
            addLinkToForm={addLinkToForm}
            removeLinkFromForm={removeLinkFromForm}
            handleImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface GroupModalProps {
  isEdit: boolean;
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
  handleImageUpload: (file: File) => Promise<void>;
  uploadingImage: boolean;
}

const GroupModal: React.FC<GroupModalProps> = ({
  isEdit,
  formData,
  setFormData,
  newLink,
  setNewLink,
  onSubmit,
  onClose,
  addLinkToForm,
  removeLinkFromForm,
  handleImageUpload,
  uploadingImage,
}) => {
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
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Link Group" : "Create New Link Group"}
          </h2>
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
                setFormData({ ...formData, groupName: e.target.value })
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
                setFormData({ ...formData, description: e.target.value })
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
              {/* File Upload */}
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
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Click to upload image</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={formData.profileImage}
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.value })
                }
                placeholder="Or paste image URL"
                disabled={uploadingImage}
              />
            </div>

            {formData.profileImage && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Preview:
                </p>
                <img
                  src={formData.profileImage}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Links
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
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newLink.title && newLink.url) {
                        addLinkToForm();
                      }
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
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newLink.title && newLink.url) {
                        addLinkToForm();
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addLinkToForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {formData.links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Link2 size={16} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {link.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {link.url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLinkFromForm(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
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
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isEdit ? "Update" : "Create"} Group
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupLinks;
